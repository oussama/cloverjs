import "reflect-metadata";
import { IThenable } from "promise";
export declare class ApiRouter {
    app: any;
    constructor(app: any);
    add(obj: any): void;
    private get(path, handler, requireUser, bind, params);
    private post(path, handler, requireUser, bind, params);
    private respond(handler, requireUser, params);
    private merge(obj1, obj2);
}
export declare function GET(path: string, auth?: boolean): (target: any, key: any, prop: any) => any;
export declare function POST(path: string, auth?: boolean): (target: any, key: any, prop: any) => any;
export declare function ROUTE(path: string): (target: any) => any;
export declare function p(name: any, key?: string, index?: number): (target: any, key: string, index: number) => void;
export declare function u(target: any, key?: string, index?: number): void;
export interface Options {
    express?: any;
    cors?: boolean;
    port?: number;
    parseUser?: (request) => IThenable<any>;
    pretty?: boolean;
}
export declare function bootstrap(options: Options, ...modules: any[]): ApiRouter;
