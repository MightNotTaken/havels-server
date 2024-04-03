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
exports.CalibrationBench = void 0;
var typeorm_1 = require("typeorm");
var Pod_1 = require("./Pod");
var CalibrationBench = /** @class */ (function () {
    function CalibrationBench(body) {
        if (!body) {
            return;
        }
        this.name = body.name;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], CalibrationBench.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            length: 30,
            nullable: false
        }),
        __metadata("design:type", String)
    ], CalibrationBench.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return Pod_1.CalibrationPod; }, function (pod) { return pod.bench; }, {
            cascade: true,
        }),
        __metadata("design:type", Array)
    ], CalibrationBench.prototype, "pods", void 0);
    CalibrationBench = __decorate([
        (0, typeorm_1.Entity)(),
        __metadata("design:paramtypes", [Object])
    ], CalibrationBench);
    return CalibrationBench;
}());
exports.CalibrationBench = CalibrationBench;
//# sourceMappingURL=Bench.js.map