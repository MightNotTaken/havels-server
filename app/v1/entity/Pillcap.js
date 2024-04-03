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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pillcap = void 0;
var typeorm_1 = require("typeorm");
var Pillcap = /** @class */ (function () {
    function Pillcap(body) {
        if (!body) {
            return;
        }
        this.imei = body.imei;
        this.op = body.op;
        this.lac = body.lac;
        this.ci = body.ci;
        this.battery = body.battery;
        this.signal = body.signal;
        this.time = body.time;
        this.number = body.number;
        this.hits = 1;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Pillcap.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            length: 22
        }),
        __metadata("design:type", String)
    ], Pillcap.prototype, "imei", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            length: 50
        }),
        __metadata("design:type", String)
    ], Pillcap.prototype, "op", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            length: 5
        }),
        __metadata("design:type", String)
    ], Pillcap.prototype, "lac", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            length: 5
        }),
        __metadata("design:type", String)
    ], Pillcap.prototype, "ci", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            default: 100
        }),
        __metadata("design:type", Number)
    ], Pillcap.prototype, "battery", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            default: 1
        }),
        __metadata("design:type", Number)
    ], Pillcap.prototype, "signal", void 0);
    __decorate([
        (0, typeorm_1.Column)({}),
        __metadata("design:type", Date)
    ], Pillcap.prototype, "time", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            length: 15
        }),
        __metadata("design:type", String)
    ], Pillcap.prototype, "number", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            default: 1
        }),
        __metadata("design:type", Number)
    ], Pillcap.prototype, "hits", void 0);
    Pillcap = __decorate([
        (0, typeorm_1.Entity)(),
        __metadata("design:paramtypes", [Object])
    ], Pillcap);
    return Pillcap;
}());
exports.Pillcap = Pillcap;
//# sourceMappingURL=Pillcap.js.map