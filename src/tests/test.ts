import {bootstrap,ROUTE,GET,POST,p,r,ResponseType} from '../index';
/**
 * TestRoute
 */
@ROUTE('/items')
class TestRoute {
    constructor() {}
    
    items:any[] = [
        {id:12,name:'cloverjs',desc:'APIs library'}   
    ];
    /*
    @GET('/:id',false)
    async readOne(@p('id') id:string){
        return this.items.find(elm=>elm.id==id);
    }
*/
    @GET('/',false)
    async readAll(){
        return this.items;
    }

    @POST('/',false)
    async create(@r('body') body:any){
        this.items.push(body);
    }

    @GET('/search',false)
    async search(@p('q') q:any){
       return q;
    }


}

var route0 = new TestRoute();

bootstrap({
    root:'/api',
    port:5000,
    responseType:ResponseType.StatusCode
},route0);
