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
exports.CalibrationPod = void 0;
var typeorm_1 = require("typeorm");
var Bench_1 = require("./Bench");
var Entry_1 = require("./Entry");
var CalibrationPod = /** @class */ (function () {
    function CalibrationPod(body) {
        if (!body) {
            return;
        }
        this.entries = [];
        this.name = body.name;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], CalibrationPod.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            length: 10
        }),
        __metadata("design:type", String)
    ], CalibrationPod.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return Bench_1.CalibrationBench; }, function (bench) { return bench.pods; }, {
            orphanedRowAction: 'delete',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }),
        __metadata("design:type", Bench_1.CalibrationBench)
    ], CalibrationPod.prototype, "bench", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return Entry_1.CalibrationPodEntry; }, function (entry) { return entry.pod; }, {
            cascade: true,
        }),
        __metadata("design:type", Array)
    ], CalibrationPod.prototype, "entries", void 0);
    CalibrationPod = __decorate([
        (0, typeorm_1.Entity)(),
        __metadata("design:paramtypes", [Object])
    ], CalibrationPod);
    return CalibrationPod;
}());
exports.CalibrationPod = CalibrationPod;
//# sourceMappingURL=Pod.js.map