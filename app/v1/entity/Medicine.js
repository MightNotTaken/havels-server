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
exports.Medicine = void 0;
var typeorm_1 = require("typeorm");
var Pillbox_1 = require("./Pillbox");
var Medicine = /** @class */ (function () {
    function Medicine(body) {
        if (!body) {
            return;
        }
        this.time = body.time;
        this.vile = body.vile;
        this.pills = body.pills;
        this.repeat = body.repeat;
        this.device = body.device;
        this.reference = body.reference;
        this.fetched = false;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Medicine.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            length: 10
        }),
        __metadata("design:type", String)
    ], Medicine.prototype, "time", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Medicine.prototype, "vile", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            default: false
        }),
        __metadata("design:type", Boolean)
    ], Medicine.prototype, "fetched", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Medicine.prototype, "pills", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            unique: true
        }),
        __metadata("design:type", Number)
    ], Medicine.prototype, "reference", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            default: 20,
        }),
        __metadata("design:type", Number)
    ], Medicine.prototype, "repeat", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return Pillbox_1.Pillbox; }, function (pillbox) { return pillbox.medicines; }, {
            orphanedRowAction: 'delete',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }),
        __metadata("design:type", Pillbox_1.Pillbox)
    ], Medicine.prototype, "device", void 0);
    Medicine = __decorate([
        (0, typeorm_1.Entity)(),
        __metadata("design:paramtypes", [Object])
    ], Medicine);
    return Medicine;
}());
exports.Medicine = Medicine;
//# sourceMappingURL=Medicine.js.map