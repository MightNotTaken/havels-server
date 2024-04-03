"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var Pillcap_1 = require("../entity/Pillcap");
var log_util_1 = __importDefault(require("../utils/log.util"));
var mqtt_util_1 = __importDefault(require("../utils/mqtt.util"));
var PillcapRepository = db_1.AppDataSource.getRepository(Pillcap_1.Pillcap);
var PillcapController = /** @class */ (function () {
    function PillcapController() {
    }
    PillcapController.prototype.getDetails = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var imei, pillcap_1, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        imei = req.body.imei;
                        if (!imei) {
                            imei = (_a = req.query) === null || _a === void 0 ? void 0 : _a.imei;
                        }
                        if (!imei) {
                            return [2 /*return*/, res.status(400).json({
                                    message: 'Missing parameters',
                                    expected: {
                                        imei: 'string type value'
                                    }
                                })];
                        }
                        return [4 /*yield*/, PillcapRepository.findOne({ where: { imei: imei } })];
                    case 1:
                        pillcap_1 = _b.sent();
                        if (!pillcap_1) {
                            return [2 /*return*/, res.status(400).send({
                                    message: 'Pillcap not found with imei ' + imei
                                })];
                        }
                        return [2 /*return*/, res.status(200).send(pillcap_1)];
                    case 2:
                        error_1 = _b.sent();
                        console.error('error in pillcap getDetails', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PillcapController.prototype.reset = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var imei, pillcap_2, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        imei = req.body.imei;
                        if (!imei) {
                            imei = (_a = req.query) === null || _a === void 0 ? void 0 : _a.imei;
                        }
                        if (!imei) {
                            return [2 /*return*/, res.status(400).json({
                                    message: 'Missing parameters',
                                    expected: {
                                        imei: 'string type value'
                                    }
                                })];
                        }
                        return [4 /*yield*/, PillcapRepository.findOne({ where: { imei: imei } })];
                    case 1:
                        pillcap_2 = _b.sent();
                        if (!pillcap_2) {
                            return [2 /*return*/, res.status(400).send({
                                    message: 'Pillcap not found with imei ' + imei
                                })];
                        }
                        pillcap_2.hits = 1;
                        return [4 /*yield*/, PillcapRepository.save(pillcap_2)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, res.status(200).send(pillcap_2)];
                    case 3:
                        error_2 = _b.sent();
                        console.error('error in pillcap getDetails', error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PillcapController.prototype.registerEvents = function () {
        var _this = this;
        mqtt_util_1.default.listen('pillcap', function (_data) { return __awaiter(_this, void 0, void 0, function () {
            var _a, imei, op, lac, ci, battery, signal, date, time_1, _b, year_1, month_1, day_1, data, response_1, pillcap_3, error_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 7, , 8]);
                        _a = _data.split(','), imei = _a[0], op = _a[1], lac = _a[2], ci = _a[3], battery = _a[4], signal = _a[5], date = _a[6], time_1 = _a[7];
                        _b = date.split('/'), year_1 = _b[0], month_1 = _b[1], day_1 = _b[2];
                        data = {
                            imei: imei.slice(0, 15),
                            op: op,
                            lac: lac,
                            ci: ci,
                            battery: +battery,
                            signal: +signal,
                            time: (function () {
                                return "".concat(2000 + +year_1, "-").concat(month_1, "-").concat(day_1, " ").concat(time_1.split('+')[0]);
                            })()
                        };
                        data["number"] = "918899150225";
                        console.log(data);
                        return [4 /*yield*/, log_util_1.default.passOnPillcapData(data)];
                    case 1:
                        response_1 = _c.sent();
                        console.log(response_1);
                        data.time = new Date(time_1);
                        return [4 /*yield*/, PillcapRepository.findOne({ where: { imei: imei } })];
                    case 2:
                        pillcap_3 = _c.sent();
                        if (!!pillcap_3) return [3 /*break*/, 4];
                        return [4 /*yield*/, PillcapRepository.create(__assign(__assign({}, data), { hits: 1 }))];
                    case 3:
                        pillcap_3 = _c.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        pillcap_3.hits += 1;
                        _c.label = 5;
                    case 5: return [4 /*yield*/, PillcapRepository.save(pillcap_3)];
                    case 6:
                        _c.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_3 = _c.sent();
                        console.error((error_3 === null || error_3 === void 0 ? void 0 : error_3.message) || error_3);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        }); });
    };
    return PillcapController;
}());
;
var pillcap = new PillcapController();
exports.default = pillcap;
//# sourceMappingURL=pillcap.controller.js.map