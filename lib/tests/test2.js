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
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
let FakeAuth = class FakeAuth {
    auth(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(email, password);
            return null;
        });
    }
};
__decorate([
    index_1.GET('/', false) // false for not requiring authentication
    ,
    __param(0, index_1.p('email')), __param(1, index_1.p('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FakeAuth.prototype, "auth", null);
FakeAuth = __decorate([
    index_1.ROUTE('/books')
], FakeAuth);
exports.FakeAuth = FakeAuth;
function parseUser(req) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('parseUser');
        return null;
    });
}
// bootstrap create expressjs app 
index_1.bootstrap({
    port: 8888,
    root: '/api',
    responseType: index_1.ResponseType.StatusCode,
    parseUser: parseUser
}, new FakeAuth());
