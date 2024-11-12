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
exports.Batch = void 0;
// Batch.ts
var typeorm_1 = require("typeorm");
var Bench_1 = require("./Bench");
var Batch = /** @class */ (function () {
    function Batch(body) {
        if (!body) {
            return;
        }
        this.mode = body.mode;
        this.current = body.current;
        this.ambient = body.ambient;
        this.t1 = body.t1;
        this.t2 = body.t2;
        this.t3 = body.t3;
        this.t4 = body.t4;
        this.bench = body.bench;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Batch.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "enum",
            enum: ["cal", "ver"],
            nullable: false,
        }),
        __metadata("design:type", String)
    ], Batch.prototype, "mode", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: false }),
        __metadata("design:type", String)
    ], Batch.prototype, "rating", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "float", nullable: false }),
        __metadata("design:type", Number)
    ], Batch.prototype, "current", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "float", nullable: false }),
        __metadata("design:type", Number)
    ], Batch.prototype, "ambient", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "float", nullable: false }),
        __metadata("design:type", Number)
    ], Batch.prototype, "t1", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "float", nullable: false }),
        __metadata("design:type", Number)
    ], Batch.prototype, "t2", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "float", nullable: false }),
        __metadata("design:type", Number)
    ], Batch.prototype, "t3", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "float", nullable: false }),
        __metadata("design:type", Number)
    ], Batch.prototype, "t4", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", Date)
    ], Batch.prototype, "timestamp", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return Bench_1.CalibrationBench; }, function (bench) { return bench.pods; }, {
            orphanedRowAction: 'delete',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }),
        __metadata("design:type", Bench_1.CalibrationBench)
    ], Batch.prototype, "bench", void 0);
    Batch = __decorate([
        (0, typeorm_1.Entity)(),
        __metadata("design:paramtypes", [Object])
    ], Batch);
    return Batch;
}());
exports.Batch = Batch;
//# sourceMappingURL=Batch.js.map