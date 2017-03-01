import "reflect-metadata";
export declare var Status: {
    Ok: number;
    Created: number;
    NoContent: number;
    BadRequest: number;
    Unauthorized: number;
    Forbidden: number;
    NotFound: number;
    Conflict: number;
    InternalServerError: number;
};
export declare function BadRequest(message: string): {
    code: number;
    message: string;
};
export declare function NotImplemented(message: string): {
    code: number;
    message: string;
};
export declare function InternalError(message: string): {
    code: number;
    message: string;
};
export declare function Unauthorized(message: string): {
    code: number;
    message: string;
};
export declare function Forbidden(message: string): {
    code: number;
    message: string;
};
export declare enum ResponseType {
    ErrorData = 0,
    StatusCode = 1,
}
export declare class ApiRouter {
    app: any;
    responseType: ResponseType;
    constructor(app: any);
    add(obj: any): void;
    private get(path, handler, requireUser, bind, params);
    private post(path, handler, requireUser, bind, params);
    private respond(handler, requireUser, params);
    successResponse(res: any, data: any): void;
    errorResponse(res: any, error: any): void;
    private merge(obj1, obj2);
}
export declare function GET(path: string, auth?: boolean): (target: any, key: any, prop: any) => any;
export declare function RAW(method: string, path: string): (target: any, key: any, prop: any) => any;
export declare function POST(path: string, auth?: boolean): (target: any, key: any, prop: any) => any;
export declare function ROUTE(path: string): (target: any) => any;
export declare function p(name: any, key?: string, index?: number): (target: any, key: string, index: number) => void;
export declare function u(name: any, key?: string, index?: number): (target: any, key: string, index: number) => void;
export declare function r(name: any, key?: string, index?: number): any;
export interface Options {
    root?: string;
    express?: any;
    cors?: boolean;
    port?: number;
    parseUser?: (request) => Promise<any>;
    pretty?: boolean;
    https?: any;
    responseType?: ResponseType;
    bodyRaw?: boolean;
}
export declare function bootstrap(options: Options, ...modules: any[]): ApiRouter;
