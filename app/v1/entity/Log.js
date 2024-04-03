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
exports.Log = void 0;
var typeorm_1 = require("typeorm");
var Pillcap_1 = require("./Pillcap");
var Log = /** @class */ (function () {
    function Log(body) {
        if (!body) {
            return;
        }
        this.time = new Date();
        this.device = body.device;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Log.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Date)
    ], Log.prototype, "time", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return Pillcap_1.Pillcap; }, function (pillcap) { return pillcap.logs; }, {
            orphanedRowAction: 'delete',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }),
        __metadata("design:type", Object)
    ], Log.prototype, "device", void 0);
    Log = __decorate([
        (0, typeorm_1.Entity)(),
        __metadata("design:paramtypes", [Object])
    ], Log);
    return Log;
}());
exports.Log = Log;
//# sourceMappingURL=Log.js.map