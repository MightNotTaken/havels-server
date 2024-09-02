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
exports.Station = void 0;
var typeorm_1 = require("typeorm");
var HourlyStationCount_1 = require("./HourlyStationCount");
var Station = /** @class */ (function () {
    function Station(body) {
        if (!body) {
            return;
        }
        this.hourlyCounts = [];
        this.name = body.name;
        this.mac = body.mac;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Station.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return HourlyStationCount_1.HourlyCount; }, function (hc) { return hc.station; }, {
            cascade: true,
        }),
        __metadata("design:type", Array)
    ], Station.prototype, "hourlyCounts", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            length: 30,
            nullable: false
        }),
        __metadata("design:type", String)
    ], Station.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            length: 30,
            nullable: false
        }),
        __metadata("design:type", String)
    ], Station.prototype, "mac", void 0);
    Station = __decorate([
        (0, typeorm_1.Entity)(),
        __metadata("design:paramtypes", [Object])
    ], Station);
    return Station;
}());
exports.Station = Station;
//# sourceMappingURL=Station.js.map