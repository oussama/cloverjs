# cloverjs
> Rest API framework built on expressjs focused on productivity by using typescript decorators and metadata

## Install

```
$ npm install --save cloverjs
```

## Usage

```ts
import {ROUTE,GET,p,u} from 'cloverjs';

@ROUTE('/books')
class Books {
    
    @GET('/',false) // false for not requiring authentification
    async getBooks(){
        books = await ..........
        return books;
    }
    
    @GET('/:id')
    async getBook(@p('id') id:string){
        book = await ...........
        return book;
    }
    
    @POST('/')
    async createBook(@p params:any){
        // params is all the the path params,query & body merged   
    }
    
    @POST('/:id/like')
    async likeBook(@p('id'),@u user:any){
        // @u is to inject request.user   
    }
       
}

// bootstrap create expressjs app 
bootstrap({
    port:5000
},new Books());
```

## License

MIT © [Oussama Gammoudi](http://zorend.com)