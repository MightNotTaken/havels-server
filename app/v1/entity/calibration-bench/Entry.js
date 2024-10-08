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
exports.CalibrationPodEntry = void 0;
var typeorm_1 = require("typeorm");
var Pod_1 = require("./Pod");
var Batch_1 = require("./Batch");
var CalibrationPodEntry = /** @class */ (function () {
    function CalibrationPodEntry(body) {
        if (!body) {
            return;
        }
        this.barcode = body.barcode;
        this.pod = body.pod;
        this.result = body.result;
        this.tripTime = body.tripTime;
        this.batch = body.batch;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], CalibrationPodEntry.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            nullable: false
        }),
        __metadata("design:type", String)
    ], CalibrationPodEntry.prototype, "barcode", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            nullable: false
        }),
        __metadata("design:type", Number)
    ], CalibrationPodEntry.prototype, "tripTime", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            nullable: false
        }),
        __metadata("design:type", Boolean)
    ], CalibrationPodEntry.prototype, "result", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return Pod_1.CalibrationPod; }, function (pod) { return pod.entries; }, {
            orphanedRowAction: 'delete',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }),
        __metadata("design:type", Pod_1.CalibrationPod)
    ], CalibrationPodEntry.prototype, "pod", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return Batch_1.Batch; }, {
            nullable: false,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }),
        (0, typeorm_1.JoinColumn)({ name: 'batch_id' }),
        __metadata("design:type", Batch_1.Batch)
    ], CalibrationPodEntry.prototype, "batch", void 0);
    CalibrationPodEntry = __decorate([
        (0, typeorm_1.Entity)(),
        __metadata("design:paramtypes", [Object])
    ], CalibrationPodEntry);
    return CalibrationPodEntry;
}());
exports.CalibrationPodEntry = CalibrationPodEntry;
//# sourceMappingURL=Entry.js.map