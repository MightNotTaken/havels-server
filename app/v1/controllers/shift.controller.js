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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("../../db");
var Shift_1 = require("../entity/Shift");
var mqtt_controller_1 = __importDefault(require("./mqtt.controller"));
var ShiftCount_1 = require("../entity/ShiftCount");
var Station_1 = require("../entity/Station");
var ShiftRepository = db_1.AppDataSource.getRepository(Shift_1.Shift);
var ShiftCountRepository = db_1.AppDataSource.getRepository(ShiftCount_1.ShiftCount);
var StationRepository = db_1.AppDataSource.getRepository(Station_1.Station);
var ShiftController = /** @class */ (function () {
    function ShiftController() {
    }
    ShiftController.prototype.getShifts = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var shifts, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, ShiftRepository.find()];
                    case 1:
                        shifts = _a.sent();
                        res.status(200).json(shifts);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        res.status(500).send(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ShiftController.validTiming = function (start, end) {
        var validator = function (time) {
            var _a = time.split(':').map(function (x) { return +x; }), hour = _a[0], min = _a[1], sec = _a[2];
            if (hour < 0 || hour > 23 || min < 0 || min >= 60 || sec < 0 || sec >= 60) {
                return false;
            }
            return true;
        };
        var toNumber = function (time) {
            var _a = time.split(':').map(function (x) { return +x; }), hour = _a[0], min = _a[1], sec = _a[2];
            return hour * 3600 + min * 60 + sec;
        };
        return validator(start) && validator(end) && toNumber(end) > toNumber(start);
    };
    ShiftController.overlap = function (shift1, shift2) {
        var toNumber = function (time) {
            var _a = time.split(':').map(function (x) { return +x; }), hour = _a[0], min = _a[1], sec = _a[2];
            return hour * 3600 + min * 60 + sec;
        };
        var first = {
            start: toNumber(shift1.start),
            end: toNumber(shift1.end)
        };
        var second = {
            start: toNumber(shift2.start),
            end: toNumber(shift2.end)
        };
        if ((first.start >= second.start && first.start <= second.end) ||
            (first.end >= second.start && first.end <= second.end) ||
            (second.start >= first.start && second.start <= first.end) ||
            (second.end >= first.start && second.end <= first.end)) {
            return true;
        }
        else {
            return false;
        }
    };
    ShiftController.prototype.addShift = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, start, end, name, shift, savedShifts, _i, savedShifts_1, sh, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        _a = req.body, start = _a.start, end = _a.end, name = _a.name;
                        if (!start || !end || !name) {
                            return [2 /*return*/, res.status(400).send({
                                    message: 'missing parameters',
                                    expected: ['start', 'end', 'name']
                                })];
                        }
                        if (!ShiftController.validTiming(start, end)) {
                            return [2 /*return*/, res.status(400).json({
                                    message: 'timing not valid'
                                })];
                        }
                        return [4 /*yield*/, ShiftRepository.findOne({
                                where: {
                                    name: name
                                }
                            })];
                    case 1:
                        shift = _b.sent();
                        if (!shift) return [3 /*break*/, 2];
                        shift.start = start;
                        shift.end = end;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, ShiftRepository.create({
                            start: start,
                            end: end,
                            name: name
                        })];
                    case 3:
                        shift = _b.sent();
                        _b.label = 4;
                    case 4: return [4 /*yield*/, ShiftRepository.find()];
                    case 5:
                        savedShifts = _b.sent();
                        for (_i = 0, savedShifts_1 = savedShifts; _i < savedShifts_1.length; _i++) {
                            sh = savedShifts_1[_i];
                            if (ShiftController.overlap(sh, shift)) {
                                return [2 /*return*/, res.status(400).send({
                                        message: 'Shifts overlap',
                                        shift: savedShifts
                                    })];
                            }
                        }
                        savedShifts.push(shift);
                        return [4 /*yield*/, ShiftRepository.save(shift)];
                    case 6:
                        _b.sent();
                        res.status(200).json(savedShifts);
                        return [3 /*break*/, 8];
                    case 7:
                        error_2 = _b.sent();
                        res.status(500).send(error_2);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    ShiftController.prototype.publish = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var shifts, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, ShiftRepository.find({})];
                    case 1:
                        shifts = _a.sent();
                        mqtt_controller_1.default.updateShifts('all', JSON.stringify(shifts));
                        res.status(200).send({
                            message: 'Shifts successfully published',
                            data: shifts
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        res.status(500).send(error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ShiftController.prototype.remove = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var name, shift, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        name = req.body.name;
                        if (!name) {
                            return [2 /*return*/, res.status(400).send({
                                    message: 'missing parameters',
                                    expected: ['name']
                                })];
                        }
                        return [4 /*yield*/, ShiftRepository.findOne({
                                where: { name: name }
                            })];
                    case 1:
                        shift = _a.sent();
                        if (!shift) {
                            return [2 /*return*/, res.status(400).send({
                                    message: 'No shift found with name ' + name
                                })];
                        }
                        return [4 /*yield*/, ShiftRepository.remove(shift)];
                    case 2:
                        _a.sent();
                        res.status(200).send({
                            message: 'Shift ' + name + ' successfully removed'
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        res.status(500).send(error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return ShiftController;
}());
;
var shiftController = new ShiftController();
exports.default = shiftController;
//# sourceMappingURL=shift.controller.js.map