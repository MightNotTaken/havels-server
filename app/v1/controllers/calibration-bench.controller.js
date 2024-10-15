"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalibrationBenchController = void 0;
var db_1 = require("../../db");
var Bench_1 = require("../entity/calibration-bench/Bench");
var Pod_1 = require("../entity/calibration-bench/Pod");
var Entry_1 = require("../entity/calibration-bench/Entry");
var BenchRepository = db_1.AppDataSource.getRepository(Bench_1.CalibrationBench);
var PodRepository = db_1.AppDataSource.getRepository(Pod_1.CalibrationPod);
var PodEntryRepository = db_1.AppDataSource.getRepository(Entry_1.CalibrationPodEntry);
var CalibrationBenchController = /** @class */ (function () {
    function CalibrationBenchController() {
    }
    CalibrationBenchController.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                for (i = 1; i <= 3; i++) {
                    try {
                        // const name = `bench-${i}`;
                        // const bench = await BenchRepository.findOne({
                        //     where: {
                        //         name
                        //     }
                        // });
                        // if (!bench) {
                        //     await CalibrationBenchController.createBench(name);
                        // }
                    }
                    catch (error) {
                        console.error();
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    CalibrationBenchController.createBench = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var name, mac, bench, i, pod, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        name = data.name, mac = data.mac;
                        return [4 /*yield*/, BenchRepository.create({
                                name: name,
                                mac: mac
                            })];
                    case 1:
                        bench = _a.sent();
                        return [4 /*yield*/, BenchRepository.save(bench)];
                    case 2:
                        _a.sent();
                        i = 1;
                        _a.label = 3;
                    case 3:
                        if (!(i <= 24)) return [3 /*break*/, 7];
                        return [4 /*yield*/, PodRepository.create({
                                name: "pod-".concat(i),
                                stationID: i
                            })];
                    case 4:
                        pod = _a.sent();
                        pod.bench = bench;
                        return [4 /*yield*/, PodRepository.save(pod)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 3];
                    case 7: return [4 /*yield*/, BenchRepository.findOne({
                            where: {
                                name: name
                            },
                            relations: ['pods']
                        })];
                    case 8: return [2 /*return*/, _a.sent()];
                    case 9:
                        error_1 = _a.sent();
                        console.error(error_1);
                        return [2 /*return*/, null];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    CalibrationBenchController.buffer = {};
    return CalibrationBenchController;
}());
exports.CalibrationBenchController = CalibrationBenchController;
var calibrationBenchController = new CalibrationBenchController();
exports.default = calibrationBenchController;
//# sourceMappingURL=calibration-bench.controller.js.map