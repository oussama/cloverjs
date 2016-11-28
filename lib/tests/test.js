"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const index_1 = require("../index");
/**
 * TestRoute
 */
let TestRoute = class TestRoute {
    constructor() {
        this.items = [
            { id: 12, name: 'cloverjs', desc: 'APIs library' }
        ];
    }
    /*
    @GET('/:id',false)
    async readOne(@p('id') id:string){
        return this.items.find(elm=>elm.id==id);
    }
*/
    readAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.items;
        });
    }
    create(body) {
        return __awaiter(this, void 0, void 0, function* () {
            this.items.push(body);
        });
    }
    search(q) {
        return __awaiter(this, void 0, void 0, function* () {
            return q;
        });
    }
};
__decorate([
    index_1.GET('/', false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestRoute.prototype, "readAll", null);
__decorate([
    index_1.POST('/', false),
    __param(0, index_1.r('body')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestRoute.prototype, "create", null);
__decorate([
    index_1.GET('/search', false),
    __param(0, index_1.p('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestRoute.prototype, "search", null);
TestRoute = __decorate([
    index_1.ROUTE('/items'),
    __metadata("design:paramtypes", [])
], TestRoute);
var route0 = new TestRoute();
index_1.bootstrap({
    root: '/api',
    port: 5000,
    responseType: index_1.ResponseType.StatusCode
}, route0);
