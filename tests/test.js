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
var index_1 = require("../index");
var User = (function () {
    function User(parameters) {
    }
    return User;
}());
var TestRoute = (function () {
    function TestRoute() {
        this.local = " local name";
    }
    TestRoute.prototype.do = function (email, u) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            console.log(_this.local, email, u);
            resolve(email);
        });
    };
    return TestRoute;
}());
__decorate([
    index_1.GET('/do', false),
    __param(0, index_1.p('email')), __param(1, index_1.p('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TestRoute.prototype, "do", null);
var route = new TestRoute();
index_1.bootstrap({ port: 5000 }, route);
//# sourceMappingURL=test.js.map