"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// edit for test
require("reflect-metadata");
const https = require("https");
function log(message) {
    console.info('cloverjs:', message);
}
exports.Status = {
    Ok: 200,
    Created: 201,
    NoContent: 204,
    BadRequest: 400,
    Unauthorized: 401,
    Forbidden: 403,
    NotFound: 404,
    Conflict: 409,
    InternalServerError: 500,
};
function toString(payload) {
    if (typeof payload == 'string')
        return payload;
    return JSON.stringify(payload);
}
function BadRequest(message) {
    return { code: 400, message: `BadRequest: ${toString(message)}` };
}
exports.BadRequest = BadRequest;
function NotImplemented(message) {
    return { code: 501, message: `NotImplemented: ${toString(message)}` };
}
exports.NotImplemented = NotImplemented;
function InternalError(message) {
    return { code: 500, message: `InternalServerError: ${toString(message)}` };
}
exports.InternalError = InternalError;
function Unauthorized(message) {
    return { code: 401, message: `Unauthorized: ${toString(message)}` };
}
exports.Unauthorized = Unauthorized;
function Forbidden(message) {
    return { code: 403, message: `Forbidden: ${toString(message)}` };
}
exports.Forbidden = Forbidden;
var ResponseType;
(function (ResponseType) {
    ResponseType[ResponseType["ErrorData"] = 0] = "ErrorData";
    ResponseType[ResponseType["StatusCode"] = 1] = "StatusCode";
})(ResponseType = exports.ResponseType || (exports.ResponseType = {}));
class ApiRouter {
    constructor(app) {
        this.app = app;
        this.responseType = ResponseType.ErrorData;
    }
    ;
    add(obj) {
        var prot = Object.getPrototypeOf(obj);
        var routes = prot.routes;
        var basePath = prot.routesPath;
        if (!basePath)
            basePath = "";
        console.log('cloverjs:', basePath);
        if (!routes)
            throw 'No routes found!';
        if (!this.app.api)
            this.app.api = [];
        routes.forEach((route) => {
            route.path = basePath + route.path;
            this[route.method](route.path, obj[route.handler], route.auth, obj, route.params ? route.params[route.handler] : []);
            this.app.api.push(route);
        });
        if (prot.rawRoutes) {
            prot.rawRoutes.forEach((route) => {
                route.path = basePath + route.path;
                this.app[route.method](route.path, obj[route.handler].bind(obj));
                this.app.api.push(route);
            });
        }
    }
    get(path, handler, requireUser = true, bind, params) {
        this.app.get(path, this.respond(handler.bind(bind), requireUser, params));
    }
    post(path, handler, requireUser = true, bind, params) {
        this.app.post(path, this.respond(handler.bind(bind), requireUser, params));
    }
    respond(handler, requireUser, params) {
        return (req, res) => {
            if (requireUser && !req.user) {
                this.errorResponse(res, { code: 401, message: 'Unauthorized' });
                return;
            }
            var data = this.merge(req.body, req.query);
            data = this.merge(data, req.params);
            if (params) {
                var args = [];
                for (var param of params) {
                    if (param == "$params") {
                        args.push(data);
                    }
                    else if (param == "$user") {
                        args.push(req.user);
                    }
                    else if (param == "$request") {
                        args.push(req);
                    }
                    else if (param && param.type == "$params") {
                        if (data[param.name] == undefined) {
                            this.errorResponse(res, { code: 400, message: 'Missing Parameter: ' + param.name });
                            return;
                        }
                        args.push(data[param.name]);
                    }
                    else if (param && param.type == "$user") {
                        args.push(req.user[param.name]);
                    }
                    else if (param && param.type == "$request") {
                        args.push(req[param.name]);
                    }
                }
                handler.apply(null, args)
                    .then(data => this.successResponse(res, data))
                    .catch(error => this.errorResponse(res, error));
            }
            else {
                handler(data, req.user, req)
                    .then(data => this.successResponse(res, data))
                    .catch(error => this.errorResponse(res, error));
            }
        };
    }
    successResponse(res, data) {
        if (this.responseType == ResponseType.ErrorData) {
            res.json({ error: null, data: data });
        }
        else if (this.responseType == ResponseType.StatusCode) {
            var statusCode = (data && data.code) ? data.code : 200;
            typeof data == 'string' ? res.status(statusCode).send(data) : res.status(statusCode).json(data);
        }
    }
    errorResponse(res, error) {
        console.log(res, error);
        if (this.responseType == ResponseType.ErrorData) {
            res.json({ error });
        }
        else if (this.responseType == ResponseType.StatusCode) {
            var statusCode = (error && error.code) ? error.code : 500;
            res.status(statusCode).json(error);
        }
    }
    merge(obj1, obj2) {
        if (!obj2)
            return obj1;
        if (!obj1)
            return obj2;
        for (var attrname in obj2) {
            obj1[attrname] = obj2[attrname];
        }
        return obj1;
    }
}
exports.ApiRouter = ApiRouter;
function GET(path, auth = true) {
    return (target, key, prop) => {
        var types = Reflect['getMetadata']("design:paramtypes", target, key);
        if (!target.$paramsTypes)
            target.$paramsTypes = {};
        if (!target.$paramsTypes[key])
            target.$paramsTypes[key] = types.map(type => type.name);
        if (!target.routes)
            target.routes = [];
        target.routes.push({ method: 'get', params: target._params, path, auth, handler: key });
        return prop;
    };
}
exports.GET = GET;
function RAW(method, path) {
    return (target, key, prop) => {
        if (!target.rawRoutes)
            target.rawRoutes = [];
        target.rawRoutes.push({ method, path, handler: key });
        return prop;
    };
}
exports.RAW = RAW;
function POST(path, auth = true) {
    return (target, key, prop) => {
        var types = Reflect['getMetadata']("design:paramtypes", target, key);
        if (!target.$paramsTypes)
            target.$paramsTypes = {};
        if (!target.$paramsTypes[key])
            target.$paramsTypes[key] = types.map(type => type.name);
        if (!target.routes)
            target.routes = [];
        target.routes.push({ method: 'post', params: target._params, path, auth, handler: key });
        return prop;
    };
}
exports.POST = POST;
function ROUTE(path) {
    return (target) => {
        target.prototype.routesPath = path;
        return target;
    };
}
exports.ROUTE = ROUTE;
function p(name, key, index) {
    if (typeof name === "string") {
        return (target, key, index) => {
            if (!target._params)
                target._params = {};
            if (!target._params[key])
                target._params[key] = [];
            target._params[key][index] = { type: '$params', name: name };
        };
    }
    else {
        var target = name;
        if (!target._params)
            target._params = {};
        if (!target._params[key])
            target._params[key] = [];
        target._params[key][index] = '$params';
    }
}
exports.p = p;
function u(name, key, index) {
    if (typeof name === "string") {
        return (target, key, index) => {
            if (!target._params)
                target._params = {};
            if (!target._params[key])
                target._params[key] = [];
            target._params[key][index] = { type: '$user', name: name };
        };
    }
    else {
        var target = name;
        if (!target._params)
            target._params = {};
        if (!target._params[key])
            target._params[key] = [];
        target._params[key][index] = '$user';
    }
}
exports.u = u;
function r(name, key, index) {
    if (typeof name === "string") {
        return (target, key, index) => {
            if (!target._params)
                target._params = {};
            if (!target._params[key])
                target._params[key] = [];
            target._params[key][index] = { type: '$request', name: name };
        };
    }
    else {
        var target = name;
        if (!target._params)
            target._params = {};
        if (!target._params[key])
            target._params[key] = [];
        target._params[key][index] = '$request';
    }
}
exports.r = r;
var express = require('express');
var bodyParser = require('body-parser');
function bootstrap(options, ...modules) {
    var expressApp = options.express || express();
    var app = express.Router();
    expressApp.use(options.root || '/', app);
    var httpsServer;
    if (options.https) {
        httpsServer = https.createServer(options.https, app);
    }
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    if (options.bodyRaw) {
        app.use(bodyParser.raw({ type: function () { return true; } }));
    }
    ;
    // use cors
    if (options.cors || options.cors == undefined) {
        app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
            next();
        });
    }
    // parse user
    if (options.parseUser) {
        app.use(function (req, res, next) {
            options.parseUser(req).then(next).catch(next);
        });
    }
    // pretiffy json output
    if (options.pretty || options.pretty == undefined) {
        expressApp.set('json spaces', 2);
    }
    var router = new ApiRouter(app);
    if (options.responseType != undefined && options.responseType != null) {
        router.responseType = options.responseType;
    }
    // api docs json
    app.get('/clover.json', function (req, res) {
        res.json(app.api);
    });
    // start express server
    if (options.port) {
        if (options.https) {
            httpsServer.listen(options.port, function () {
                console.log('TLS App Started at port: ' + options.port + ' !');
            });
        }
        else {
            expressApp.listen(options.port, function () {
                console.log('App Started at port: ' + options.port + ' !');
            });
        }
    }
    // add routes
    for (var modul of modules) {
        router.add(modul);
    }
    return router;
}
exports.bootstrap = bootstrap;
