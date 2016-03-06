import {bootstrap,GET,p} from './index';

/**
 * User
 */
class User {
    constructor(parameters) {
        
    }
}

/**
 * TestRoute
 */
class TestRoute {
    
    constructor() {
        
        
    }
    
    local:string =" local name";
    
    @GET('/do',false)
    do(@p('email') email:string,@p('user') u:any){
        return new Promise((resolve,reject)=>{
            console.log(this.local,email,u);
            resolve(email);
        });
    }
}

var route = new TestRoute();

bootstrap({port:5000},route);