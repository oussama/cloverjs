import { ROUTE,POST, GET,bootstrap, p, ResponseType } from '../index';


@ROUTE('/books')
export class FakeAuth {

    @GET('/',false) // false for not requiring authentication
    async auth(@p('email') email, @p('password') password){
        console.log(email, password);
        return null;
    }

}

async function parseUser(req){
    console.log('parseUser');
    return null;
}

// bootstrap create expressjs app 
bootstrap({
	port:8888,
	root: '/api',
	responseType: ResponseType.StatusCode,
	parseUser: parseUser
}, new FakeAuth());