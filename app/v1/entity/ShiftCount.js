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
exports.ShiftCount = void 0;
var typeorm_1 = require("typeorm");
var Station_1 = require("./Station");
var ShiftCount = /** @class */ (function () {
    function ShiftCount(body) {
        if (!body) {
            return;
        }
        this.name = body.name;
        this.date = body.date;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], ShiftCount.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            length: 30,
            nullable: false
        }),
        __metadata("design:type", String)
    ], ShiftCount.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            nullable: false
        }),
        __metadata("design:type", Date)
    ], ShiftCount.prototype, "date", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            default: 0
        }),
        __metadata("design:type", Number)
    ], ShiftCount.prototype, "count", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return Station_1.Station; }, function (station) { return station.shifts; }, {
            orphanedRowAction: 'delete',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }),
        __metadata("design:type", Station_1.Station)
    ], ShiftCount.prototype, "station", void 0);
    ShiftCount = __decorate([
        (0, typeorm_1.Entity)(),
        __metadata("design:paramtypes", [Object])
    ], ShiftCount);
    return ShiftCount;
}());
exports.ShiftCount = ShiftCount;
//# sourceMappingURL=ShiftCount.js.map