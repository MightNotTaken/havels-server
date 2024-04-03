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
var CalibrationPodEntry = /** @class */ (function () {
    function CalibrationPodEntry(body) {
        if (!body) {
            return;
        }
        this.calibrationString = body.calibrationString;
        this.verificationString = body.verificationString;
        this.shift = body.shift;
        this.barcode = body.barcode;
        this.pod = body.pod;
        this.date = body.date;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], CalibrationPodEntry.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            length: 150,
            nullable: false
        }),
        __metadata("design:type", String)
    ], CalibrationPodEntry.prototype, "calibrationString", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            length: 150,
            nullable: false
        }),
        __metadata("design:type", String)
    ], CalibrationPodEntry.prototype, "verificationString", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            length: 10,
            nullable: false
        }),
        __metadata("design:type", String)
    ], CalibrationPodEntry.prototype, "shift", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            length: 30,
            nullable: false
        }),
        __metadata("design:type", String)
    ], CalibrationPodEntry.prototype, "barcode", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Date)
    ], CalibrationPodEntry.prototype, "date", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return Pod_1.CalibrationPod; }, function (pod) { return pod.entries; }, {
            orphanedRowAction: 'delete',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }),
        __metadata("design:type", Pod_1.CalibrationPod)
    ], CalibrationPodEntry.prototype, "pod", void 0);
    CalibrationPodEntry = __decorate([
        (0, typeorm_1.Entity)(),
        __metadata("design:paramtypes", [Object])
    ], CalibrationPodEntry);
    return CalibrationPodEntry;
}());
exports.CalibrationPodEntry = CalibrationPodEntry;
//# sourceMappingURL=Entry.js.map