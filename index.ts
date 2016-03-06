import "reflect-metadata";
declare class Promise<T> {
    then(a);
    catch(a);
};

export class ApiRouter {
		
	constructor(public app){};
	
	public add(obj:any){
		var prot = Object.getPrototypeOf(obj);
		var routes:Array<any> = prot.routes;
		var basePath = prot.routesPath;
		if(!basePath) basePath= "";
		console.log('routs addded',basePath);
		if(!routes) throw 'No routes found!';
		if(!this.app.api) this.app.api = [];
		routes.forEach((route)=>{
			route.path = basePath+route.path;
			this[route.method](route.path,obj[route.handler],route.auth,obj,route.params[route.handler]);
			this.app.api.push(route);
		})
	}
	
	private get(path:string,handler:(any),requireUser=true,bind:any,params){
		this.app.get(path,this.respond(handler.bind(bind),requireUser,params));
	}

	private post(path:string,handler:(any),requireUser=true,bind:any,params){
		this.app.post(path,this.respond(handler.bind(bind),requireUser,params));
	}
	
	private respond(handler:(params,user,request)=>Promise<any>,requireUser:boolean,params){
		return (req,res)=>{
			if(requireUser && !req.user){
				res.json({error:'Unauthorized'})
				return;	
			}
			var data = this.merge(req.body,req.query);
			data = this.merge(data,req.params);
			if(params){
                var args = [];
                for(var param of params){
                    if(param && data[param]==undefined){
                        res.json({error:'Missing Parameter: '+param});
                        return;   
                    }
                    args.push(param? data[param] : null);
                }
                console.log('handler',params)
                handler.call(null,args)
                .then(data => res.json({error:null,data:data}))
                .catch(error => res.json({error:error.toString(),data:null}));
            }else{
                handler(data,req.user,req)
                .then(data => res.json({error:null,data:data}))
                .catch(error => res.json({error:error.toString(),data:null}));
            }
		}
	}
	
	private merge(obj1,obj2){
		if(!obj2) return obj1;
		if(!obj1) return obj2;
		for (var attrname in obj2) { obj1[attrname] = obj2[attrname]; }
		return obj1;
	}

}


export function GET(path:string,auth:boolean=true){
	return (target,key,prop)=>{
        var types = Reflect['getMetadata']("design:paramtypes", target, key);
        if(!target.$paramsTypes) target.$paramTypes = {};
        if(!target.$paramsTypes[key]) target.$paramsTypes[key] = types.map(type=>type.name);
        console.log(target._params[key][0],types[0].name);
		if(!target.routes) target.routes = [];
		target.routes.push({method:'get',params:target._params,path,auth,handler:key});
		return prop;
	}
}

export function POST(path:string,auth:boolean=true){
	return (target,key,prop)=>{
		if(!target.routes) target.routes = [];
		target.routes.push({method:'post',path,auth,handler:key});
		return prop;
	}
}

export function ROUTES(path:string){
	return(target)=>{
		target.prototype.routesPath = path;
		return target;
	}
}

export function p(name:string){
    return(target: any, key : string, index : number)=>{
        if(!target._params) target._params = {};
        if(!target._params[key]) target._params[key] = []; 
        target._params[key][index]=name;
    }
}





var express = require('express');
var bodyParser = require('body-parser');


export interface Options {
    express?:any,
    cors?:boolean,
    port?:number,
    parseUser?:(request)=>Promise<any>,
    pretty?:boolean
}

export function bootstrap(options:Options,...modules):ApiRouter{
	var app = options.express || express();
    
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
    
    // use cors
    if(options.cors || options.cors==undefined){
        app.use(function(req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            next();
        });
    }
    
    // parse user
    if(options.parseUser){
        app.use(function(req,res,next){
            options.parseUser(req).then(next).catch(next);
        });
    }
	
    // pretiffy json output
    if(options.pretty || options.pretty==undefined){
        app.set('json spaces', 2);
    }
    
	var router = new ApiRouter(app);
	
    // api docs json
	app.get('/clover.json',function(req,res){
		res.json(app.api);
	})
	
    // start express server
	if(options.port){
        app.listen(options.port, function () {
            console.log('App Started at port: '+options.port+' !');
        });
    }
	
    // add routes
	for(var modul of modules){
		router.add(modul);
	}
    
	return router;
}


