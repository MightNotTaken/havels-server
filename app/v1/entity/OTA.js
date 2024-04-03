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
exports.OTA = void 0;
var typeorm_1 = require("typeorm");
var OTA = /** @class */ (function () {
    function OTA(body) {
        if (!body) {
            return;
        }
        this.version = body.version;
        this.type = body.type;
        this.description = body.description;
        this.path = body.path;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], OTA.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            length: 10,
            nullable: false
        }),
        __metadata("design:type", String)
    ], OTA.prototype, "version", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            length: 20,
            nullable: false
        }),
        __metadata("design:type", String)
    ], OTA.prototype, "type", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            default: 0
        }),
        __metadata("design:type", Number)
    ], OTA.prototype, "target", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            default: 0
        }),
        __metadata("design:type", Number)
    ], OTA.prototype, "achieved", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            length: 300,
            nullable: false
        }),
        __metadata("design:type", String)
    ], OTA.prototype, "description", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            nullable: false,
            length: 150
        }),
        __metadata("design:type", String)
    ], OTA.prototype, "path", void 0);
    OTA = __decorate([
        (0, typeorm_1.Entity)(),
        __metadata("design:paramtypes", [Object])
    ], OTA);
    return OTA;
}());
exports.OTA = OTA;
//# sourceMappingURL=OTA.js.map