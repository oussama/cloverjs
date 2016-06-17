import "reflect-metadata";
import {IThenable} from "promise";

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
        if(prot.rawRoutes){
            prot.rawRoutes.forEach((route)=>{
                route.path = basePath+route.path;
                this.app[route.method](route.path,obj[route.handler].bind(obj));
                this.app.api.push(route);
            })
        }
	}
	
	private get(path:string,handler:(any),requireUser=true,bind:any,params){
		this.app.get(path,this.respond(handler.bind(bind),requireUser,params));
	}

	private post(path:string,handler:(any),requireUser=true,bind:any,params){
		this.app.post(path,this.respond(handler.bind(bind),requireUser,params));
	}
	
	private respond(handler:(params,user,request)=>IThenable<any>,requireUser:boolean,params){
		return (req,res)=>{
			if(requireUser && !req.user){
				res.json({error:'Unauthorized'})
				return;	
			}
            console.log('before mergee');
			var data = this.merge(req.body,req.query);
			data = this.merge(data,req.params);
            console.log('after merge');
			if(params){
                var args = [];
                for(var param of params){
                    if(param=="$params"){
                        args.push(data);
                    }else if(param=="$user"){
                        args.push(req.user);
                    }else if(param=="$request"){
                        args.push(req);
                    }else if(param && param.type == "$params"){
                        if(data[param.name]==undefined){
                            res.json({error:'Missing Parameter: '+param.name});
                            return;   
                        }
                        console.log(data,param.name);
                        args.push(data[param.name]);
                    }else if(param && param.type == "$user"){
                        args.push(req.user[param.name]);
                    }else if(param && param.type == "$request"){
                        args.push(req[param.name]);
                    }
                }
                console.log('handler',params)
                handler.apply(null,args)
                .then(data => res.json({error:null,data:data}))
                .catch(error => res.json({error:JSON.stringify(error),data:null}));
            }else{
                handler(data,req.user,req)
                .then(data => res.json({error:null,data:data}))
                .catch(error => res.json({error:JSON.stringify(error),data:null}));
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
        if(!target.$paramsTypes) target.$paramsTypes = {};
        if(!target.$paramsTypes[key]) target.$paramsTypes[key] = types.map(type=>type.name);
		if(!target.routes) target.routes = [];
		target.routes.push({method:'get',params:target._params,path,auth,handler:key});
		return prop;
	}
}

export function RAW(method:string,path:string){
	return (target,key,prop)=>{
		if(!target.rawRoutes) target.rawRoutes = [];
		target.rawRoutes.push({method,path,handler:key});
		return prop;
	}
}

export function POST(path:string,auth:boolean=true){
	return (target,key,prop)=>{
		var types = Reflect['getMetadata']("design:paramtypes", target, key);
        if(!target.$paramsTypes) target.$paramsTypes = {};
        if(!target.$paramsTypes[key]) target.$paramsTypes[key] = types.map(type=>type.name);
		if(!target.routes) target.routes = [];
		target.routes.push({method:'post',params:target._params,path,auth,handler:key});
		return prop;
	}
}

export function ROUTE(path:string){
	return(target)=>{
		target.prototype.routesPath = path;
		return target;
	}
}

export function p(name:any, key? : string, index? : number){
    if(typeof name === "string"){
        return(target: any, key : string, index : number)=>{
            if(!target._params) target._params = {};
            if(!target._params[key]) target._params[key] = []; 
            target._params[key][index]={type:'$params',name:name};
        }
    }else{
        var target = name;
        if(!target._params) target._params = {};
        if(!target._params[key]) target._params[key] = []; 
        target._params[key][index]='$params';
    }
}

export function u(name:any, key? : string, index? : number){
    
    if(typeof name === "string"){
        return(target: any, key : string, index : number)=>{
            if(!target._params) target._params = {};
            if(!target._params[key]) target._params[key] = []; 
            target._params[key][index]={type:'$user',name:name};
        }
    }else{
        var target = name;
        if(!target._params) target._params = {};
        if(!target._params[key]) target._params[key] = []; 
        target._params[key][index]='$user';
    }
    
}

export function r(name:any, key? : string, index? : number):any{
    
    if(typeof name === "string"){
        return(target: any, key : string, index : number)=>{
            if(!target._params) target._params = {};
            if(!target._params[key]) target._params[key] = []; 
            target._params[key][index]={type:'$request',name:name};
        }
    }else{
        var target = name;
        if(!target._params) target._params = {};
        if(!target._params[key]) target._params[key] = []; 
        target._params[key][index]='$request';
    }
    
}




var express = require('express');
var bodyParser = require('body-parser');


export interface Options {
    express?:any,
    cors?:boolean,
    port?:number,
    parseUser?:(request)=>IThenable<any>,
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
            res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
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


