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
exports.HourlyCount = void 0;
var typeorm_1 = require("typeorm");
var Station_1 = require("./Station");
var HourlyCount = /** @class */ (function () {
    function HourlyCount(body) {
        if (!body) {
            return;
        }
        this.date = body.date;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], HourlyCount.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            nullable: false
        }),
        __metadata("design:type", Date)
    ], HourlyCount.prototype, "date", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            default: 0
        }),
        __metadata("design:type", Number)
    ], HourlyCount.prototype, "hour", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            default: 0
        }),
        __metadata("design:type", Number)
    ], HourlyCount.prototype, "count", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return Station_1.Station; }, function (station) { return station.hourlyCounts; }, {
            orphanedRowAction: 'delete',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }),
        __metadata("design:type", Station_1.Station)
    ], HourlyCount.prototype, "station", void 0);
    HourlyCount = __decorate([
        (0, typeorm_1.Entity)(),
        __metadata("design:paramtypes", [Object])
    ], HourlyCount);
    return HourlyCount;
}());
exports.HourlyCount = HourlyCount;
//# sourceMappingURL=HourlyStationCount.js.map