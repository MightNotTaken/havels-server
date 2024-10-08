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
exports.SPM = void 0;
var typeorm_1 = require("typeorm");
var Entry_1 = require("./Entry");
var SPM = /** @class */ (function () {
    function SPM(body) {
        if (!body) {
            return;
        }
        this.name = body.name;
        this.mac = body.mac;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], SPM.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            length: 10
        }),
        __metadata("design:type", String)
    ], SPM.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            nullable: true
        }),
        __metadata("design:type", String)
    ], SPM.prototype, "mac", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return Entry_1.SPMEntry; }, function (entry) { return entry.spm; }, {
            cascade: true,
        }),
        __metadata("design:type", Array)
    ], SPM.prototype, "entries", void 0);
    SPM = __decorate([
        (0, typeorm_1.Entity)(),
        __metadata("design:paramtypes", [Object])
    ], SPM);
    return SPM;
}());
exports.SPM = SPM;
//# sourceMappingURL=SPM.js.map