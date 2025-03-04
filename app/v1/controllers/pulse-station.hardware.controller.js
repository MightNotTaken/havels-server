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
var HourlyStationCount_1 = require("../entity/HourlyStationCount");
var Station_1 = require("../entity/Station");
var ws_util_1 = __importDefault(require("../utils/ws.util"));
var stationRepo = db_1.AppDataSource.getRepository(Station_1.Station);
var hourCountRepo = db_1.AppDataSource.getRepository(HourlyStationCount_1.HourlyCount);
var stationList = {};
var hourlyCountList = {};
var PulseStationController = /** @class */ (function () {
    function PulseStationController() {
    }
    PulseStationController.prototype.getDateString = function (raw) {
        if (raw === void 0) { raw = false; }
        var date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        if (raw) {
            return date;
        }
        return "".concat(date.getDate(), "/").concat(date.getMonth() + 1, "/").concat(date.getFullYear());
    };
    PulseStationController.prototype.loadInitialData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stations, _i, stations_1, station;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, stationRepo.find()];
                    case 1:
                        stations = _a.sent();
                        for (_i = 0, stations_1 = stations; _i < stations_1.length; _i++) {
                            station = stations_1[_i];
                            stationList[station.name] = station;
                            // await this.loadHourlyCount(station);
                        }
                        setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                            var hourlyCountToSave, date, station, hour, data, _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        hourlyCountToSave = [];
                                        for (date in hourlyCountList) {
                                            for (station in hourlyCountList[date]) {
                                                for (hour in hourlyCountList[date][station]) {
                                                    data = __assign({}, hourlyCountList[date][station][hour]);
                                                    if (data.changed) {
                                                        hourlyCountList[date][station][hour].changed = false;
                                                        delete data.changed;
                                                        hourlyCountToSave.push(data);
                                                    }
                                                }
                                            }
                                        }
                                        if (!hourlyCountToSave.length) return [3 /*break*/, 2];
                                        _b = (_a = console).log;
                                        return [4 /*yield*/, hourCountRepo.save(hourlyCountToSave)];
                                    case 1:
                                        _b.apply(_a, [_c.sent()]);
                                        _c.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); }, 10000);
                        return [2 /*return*/];
                }
            });
        });
    };
    PulseStationController.prototype.loadHourlyCount = function (station, i) {
        return __awaiter(this, void 0, void 0, function () {
            var criteria, saved;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!hourlyCountList) {
                            hourlyCountList = {};
                        }
                        if (!hourlyCountList[this.getDateString()]) {
                            hourlyCountList = {};
                            hourlyCountList[this.getDateString()] = {};
                        }
                        if (!hourlyCountList[this.getDateString()][station.name]) {
                            hourlyCountList[this.getDateString()][station.name] = {};
                        }
                        criteria = {
                            station: station,
                            hour: i,
                            date: this.getDateString(true)
                        };
                        if (!!hourlyCountList[this.getDateString()][station.name][i]) return [3 /*break*/, 5];
                        return [4 /*yield*/, hourCountRepo.findOne({
                                where: criteria
                            })];
                    case 1:
                        saved = _a.sent();
                        if (!!saved) return [3 /*break*/, 4];
                        return [4 /*yield*/, hourCountRepo.create({
                                hour: i,
                                date: this.getDateString(true),
                                station: station,
                                count: 0
                            })];
                    case 2:
                        saved = _a.sent();
                        return [4 /*yield*/, hourCountRepo.save(saved)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        hourlyCountList[this.getDateString()][station.name][i] = saved;
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    PulseStationController.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ws_util_1.default.dataPipelines['ps'].subscribe(function (rawData) { return __awaiter(_this, void 0, void 0, function () {
                            var event, data, _a, mac, stations, _i, stations_2, name, savedStation, _b, mac, station, data_2, _c, data_1, hourCount, _d, hour, count, hourlyCount, error_1;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        _e.trys.push([0, 12, , 13]);
                                        event = rawData.event, data = rawData.data;
                                        _a = event;
                                        switch (_a) {
                                            case 'connect': return [3 /*break*/, 1];
                                            case 'data': return [3 /*break*/, 10];
                                        }
                                        return [3 /*break*/, 11];
                                    case 1:
                                        mac = data.mac, stations = data.stations;
                                        _i = 0, stations_2 = stations;
                                        _e.label = 2;
                                    case 2:
                                        if (!(_i < stations_2.length)) return [3 /*break*/, 9];
                                        name = stations_2[_i];
                                        return [4 /*yield*/, stationRepo.findOne({
                                                where: {
                                                    mac: mac,
                                                    name: name
                                                }
                                            })];
                                    case 3:
                                        savedStation = _e.sent();
                                        if (!!savedStation) return [3 /*break*/, 6];
                                        return [4 /*yield*/, stationRepo.create({
                                                mac: mac,
                                                name: name
                                            })];
                                    case 4:
                                        savedStation = _e.sent();
                                        return [4 /*yield*/, stationRepo.save(savedStation)];
                                    case 5:
                                        _e.sent();
                                        return [3 /*break*/, 7];
                                    case 6:
                                        console.log("saved station", savedStation);
                                        _e.label = 7;
                                    case 7:
                                        stationList[savedStation.name] = savedStation;
                                        _e.label = 8;
                                    case 8:
                                        _i++;
                                        return [3 /*break*/, 2];
                                    case 9: return [3 /*break*/, 11];
                                    case 10:
                                        {
                                            _b = rawData.data, mac = _b.mac, station = _b.station, data_2 = _b.data;
                                            for (_c = 0, data_1 = data_2; _c < data_1.length; _c++) {
                                                hourCount = data_1[_c];
                                                console.log(mac, station, data_2);
                                                _d = hourCount.split(':').map(function (x) { return +x; }), hour = _d[0], count = _d[1];
                                                hourlyCount = null;
                                                try {
                                                    hourlyCount = hourlyCountList[this.getDateString()][station][hour];
                                                }
                                                catch (error) {
                                                }
                                                finally {
                                                    if (!hourlyCount) {
                                                        this.loadHourlyCount(stationList[station], hour);
                                                    }
                                                    hourlyCount = hourlyCountList[this.getDateString()][station][hour];
                                                }
                                                hourlyCount.count = count;
                                                hourlyCount.changed = true;
                                                // await hourCountRepo.save(hourlyCount);
                                            }
                                        }
                                        return [3 /*break*/, 11];
                                    case 11: return [3 /*break*/, 13];
                                    case 12:
                                        error_1 = _e.sent();
                                        return [3 /*break*/, 13];
                                    case 13: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, this.loadInitialData()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return PulseStationController;
}());
;
var psCtrl = new PulseStationController();
exports.default = psCtrl;
//# sourceMappingURL=pulse-station.hardware.controller.js.map