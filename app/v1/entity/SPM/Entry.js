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
exports.SPMEntry = void 0;
var typeorm_1 = require("typeorm");
var SPM_1 = require("./SPM");
var SPMEntry = /** @class */ (function () {
    function SPMEntry(body) {
        if (!body) {
            return;
        }
        this.shift = body.shift;
        this.data = body.data;
        this.date = body.date;
        this.spm = body.spm;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], SPMEntry.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            length: 10,
            nullable: false
        }),
        __metadata("design:type", String)
    ], SPMEntry.prototype, "shift", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            length: 70,
            nullable: false
        }),
        __metadata("design:type", String)
    ], SPMEntry.prototype, "data", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Date)
    ], SPMEntry.prototype, "date", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return SPM_1.SPM; }, function (spm) { return spm.entries; }, {
            orphanedRowAction: 'delete',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }),
        __metadata("design:type", SPM_1.SPM)
    ], SPMEntry.prototype, "spm", void 0);
    SPMEntry = __decorate([
        (0, typeorm_1.Entity)(),
        __metadata("design:paramtypes", [Object])
    ], SPMEntry);
    return SPMEntry;
}());
exports.SPMEntry = SPMEntry;
//# sourceMappingURL=Entry.js.map