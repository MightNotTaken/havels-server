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
exports.Pillbox = void 0;
var typeorm_1 = require("typeorm");
var Medicine_1 = require("./Medicine");
var WiFi_1 = require("./WiFi");
var Pillbox = /** @class */ (function () {
    function Pillbox(body) {
        if (!body) {
            return;
        }
        this.mac = body.mac;
        this.medicines = [];
        this.type = body.type;
        this.currentVersion = "1.0.0";
        this.newVersion = body.newVersion;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Pillbox.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            nullable: false,
            unique: true,
            length: 15
        }),
        __metadata("design:type", String)
    ], Pillbox.prototype, "mac", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            nullable: false,
            default: 'pillbox',
            length: 15
        }),
        __metadata("design:type", String)
    ], Pillbox.prototype, "type", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            default: "1.0.0",
            length: 20
        }),
        __metadata("design:type", String)
    ], Pillbox.prototype, "currentVersion", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            default: "1.0.0",
            length: 20
        }),
        __metadata("design:type", String)
    ], Pillbox.prototype, "newVersion", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            default: '000000',
            length: 6
        }),
        __metadata("design:type", String)
    ], Pillbox.prototype, "viles", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            default: '000000',
            length: 6
        }),
        __metadata("design:type", String)
    ], Pillbox.prototype, "compartments", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            nullable: true
        }),
        __metadata("design:type", String)
    ], Pillbox.prototype, "uptime", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            default: 0
        }),
        __metadata("design:type", Number)
    ], Pillbox.prototype, "battery", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return Medicine_1.Medicine; }, function (medicine) { return medicine.device; }, {
            cascade: true,
        }),
        __metadata("design:type", Array)
    ], Pillbox.prototype, "medicines", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return WiFi_1.WiFi; }, function (wifi) { return wifi.device; }, {
            cascade: true,
        }),
        __metadata("design:type", Array)
    ], Pillbox.prototype, "credentials", void 0);
    Pillbox = __decorate([
        (0, typeorm_1.Entity)(),
        __metadata("design:paramtypes", [Object])
    ], Pillbox);
    return Pillbox;
}());
exports.Pillbox = Pillbox;
//# sourceMappingURL=Pillbox.js.map