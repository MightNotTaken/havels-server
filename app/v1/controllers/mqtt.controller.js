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
var mqtt_util_1 = __importDefault(require("../utils/mqtt.util"));
var Station_1 = require("../entity/Station");
var ShiftCount_1 = require("../entity/ShiftCount");
var calibration_bench_controller_1 = __importDefault(require("./calibration-bench.controller"));
var SPM_1 = require("../entity/SPM/SPM");
var Entry_1 = require("../entity/SPM/Entry");
var HourlyStationCount_1 = require("../entity/HourlyStationCount");
var ShiftRepository = db_1.AppDataSource.getTreeRepository(Shift_1.Shift);
var StationRepository = db_1.AppDataSource.getTreeRepository(Station_1.Station);
var HourlyCountRepository = db_1.AppDataSource.getTreeRepository(HourlyStationCount_1.HourlyCount);
var ShiftCountRepository = db_1.AppDataSource.getTreeRepository(ShiftCount_1.ShiftCount);
var SPMRepository = db_1.AppDataSource.getRepository(SPM_1.SPM);
var SPMEntryRepository = db_1.AppDataSource.getRepository(Entry_1.SPMEntry);
var MQTTController = /** @class */ (function () {
    function MQTTController() {
        var _this = this;
        this.client = null;
        mqtt_util_1.default.onConnect(function (client) {
            console.log('MQTT connection established');
            _this.client = client;
            _this.registerDeviceEvents();
        });
    }
    MQTTController.prototype.registerDeviceEvents = function () {
        var _this = this;
        mqtt_util_1.default.listen('connect', function (data) { return __awaiter(_this, void 0, void 0, function () {
            var _a, mac_1, station, stationData, shifts_1, error_1;
            var _this = this;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 6, , 7]);
                        _a = JSON.parse(data), mac_1 = _a.mac, station = _a.station;
                        console.log('connection', { mac: mac_1, station: station });
                        return [4 /*yield*/, StationRepository.findOne({
                                where: {
                                    name: station
                                },
                                relations: ['shifts']
                            })];
                    case 1:
                        stationData = _c.sent();
                        if (!!stationData) return [3 /*break*/, 4];
                        return [4 /*yield*/, StationRepository.create({
                                name: station,
                                mac: mac_1
                            })];
                    case 2:
                        stationData = _c.sent();
                        return [4 /*yield*/, StationRepository.save(stationData)];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4: return [4 /*yield*/, ShiftRepository.find()];
                    case 5:
                        shifts_1 = _c.sent();
                        setTimeout(function () {
                            _this.updateShifts(mac_1, JSON.stringify(shifts_1));
                        }, 1000);
                        (_b = this.client) === null || _b === void 0 ? void 0 : _b.publish("".concat(mac_1, "/utc"), this.getTime() + '_' + this.getDate());
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _c.sent();
                        console.error(error_1);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
        mqtt_util_1.default.listen("hourly-station-count", function (data) { return __awaiter(_this, void 0, void 0, function () {
            var _a, hour, stationName, count, mac, station, date, hourlyCount, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 10, , 11]);
                        console.log(data);
                        _a = JSON.parse(data), hour = _a[0], stationName = _a[1], count = _a[2], mac = _a[3];
                        return [4 /*yield*/, StationRepository.findOne({
                                where: {
                                    name: stationName
                                }
                            })];
                    case 1:
                        station = _b.sent();
                        if (!!station) return [3 /*break*/, 4];
                        return [4 /*yield*/, StationRepository.create({
                                name: stationName,
                                mac: data.mac
                            })];
                    case 2:
                        station = _b.sent();
                        return [4 /*yield*/, StationRepository.save(station)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        ;
                        date = new Date();
                        date.setHours(0);
                        date.setMinutes(0);
                        date.setSeconds(0);
                        date.setMilliseconds(0);
                        return [4 /*yield*/, HourlyCountRepository.findOne({
                                where: {
                                    station: station,
                                    hour: +hour,
                                    date: date
                                }
                            })];
                    case 5:
                        hourlyCount = _b.sent();
                        if (!!hourlyCount) return [3 /*break*/, 7];
                        return [4 /*yield*/, HourlyCountRepository.create({
                                hour: +hour,
                                date: date,
                                station: station,
                                count: +count
                            })];
                    case 6:
                        hourlyCount = _b.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        hourlyCount.count = count;
                        _b.label = 8;
                    case 8: return [4 /*yield*/, HourlyCountRepository.save(hourlyCount)];
                    case 9:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        error_2 = _b.sent();
                        console.error(error_2);
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        }); });
        // MQTTService.listen("station-count", async (data) => {
        //     try {
        //         data = JSON.parse(data);
        //         console.log(data);
        //         const name = data.station;
        //         let station = await StationRepository.findOne({
        //             where: {
        //                 name
        //             },
        //             relations: ['shifts']
        //         });
        //         if (!station) {
        //             station = await StationRepository.create({
        //                 name,
        //                 mac: data.mac
        //             });
        //         }
        //         if (!station.shifts) {
        //             station.shifts = [];
        //         }
        //         let shift: ShiftCount = station.shifts?.filter(shift => getDateStamp(shift.date) == data.date && shift.name == data.current)[0];
        //         if (!shift) {
        //             let date = new Date();
        //             shift = await ShiftCountRepository.create({
        //                 name: data.current,
        //                 date,
        //                 count: +data[data.current]
        //             });
        //             station.shifts.push(shift);
        //         } else {
        //             shift.count = +data[data.current];
        //         }
        //         await StationRepository.save(station);
        //         await ShiftCountRepository.save(shift);
        //         const response: any = {};
        //         response.current = data.current;
        //         response[data.current] = +data[data.current];
        //         response["station"] = data.station;
        //         this.client.publish(`${data.mac}/reset-count`, JSON.stringify(response));
        //     } catch (error) {
        //         console.error(error);
        //     }
        // });
        mqtt_util_1.default.listen("calibration-bench", function (data) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    console.log("calibration-bench", data);
                    calibration_bench_controller_1.default.parseBuffer(data);
                }
                catch (error) {
                    console.error(error);
                }
                return [2 /*return*/];
            });
        }); });
        mqtt_util_1.default.listen("spm", function (_data) { return __awaiter(_this, void 0, void 0, function () {
            var _a, name, data, shift, spm, date, entry, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        _a = JSON.parse(_data), name = _a.name, data = _a.data, shift = _a.shift;
                        console.log('spm', {
                            name: name,
                            data: data,
                            shift: shift
                        });
                        return [4 /*yield*/, SPMRepository.findOne({
                                where: {
                                    name: name
                                }
                            })];
                    case 1:
                        spm = _b.sent();
                        if (!!spm) return [3 /*break*/, 4];
                        console.log("creating spm");
                        return [4 /*yield*/, SPMRepository.create({
                                name: name
                            })];
                    case 2:
                        spm = _b.sent();
                        return [4 /*yield*/, SPMRepository.save(spm)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        date = new Date();
                        return [4 /*yield*/, SPMEntryRepository.create({
                                data: data,
                                date: date,
                                shift: shift,
                                spm: spm
                            })];
                    case 5:
                        entry = _b.sent();
                        return [4 /*yield*/, SPMEntryRepository.save(entry)];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_3 = _b.sent();
                        console.error(error_3);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        }); });
    };
    MQTTController.prototype.getTime = function () {
        var date = new Date();
        var hours = String(date.getHours()).padStart(2, '0');
        var minutes = String(date.getMinutes()).padStart(2, '0');
        var seconds = String(date.getSeconds()).padStart(2, '0');
        return hours + ':' + minutes + ':' + seconds;
    };
    MQTTController.prototype.getDate = function () {
        var date = new Date();
        var year = String(date.getFullYear());
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var day = String(date.getDate()).padStart(2, '0');
        return year + '-' + month + '-' + day;
    };
    MQTTController.prototype.updateShifts = function (mac, data) {
        this.client.publish("".concat(mac, "/shift"), data);
    };
    MQTTController.prototype.globalOTAUpdate = function (type, version) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                (_a = this.client) === null || _a === void 0 ? void 0 : _a.publish("".concat(type, "/ota"), JSON.stringify({
                    version: version,
                    url: "".concat(process.env.OTA_BASE_URL, "?version=").concat(version, "&type=").concat(type)
                }));
                return [2 /*return*/];
            });
        });
    };
    MQTTController.prototype.updateSingleFirmware = function (type, version, mac) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                (_a = this.client) === null || _a === void 0 ? void 0 : _a.publish("".concat(mac, "/ota"), JSON.stringify({
                    version: version,
                    url: "".concat(process.env.OTA_BASE_URL, "?version=").concat(version, "&type=").concat(type)
                }));
                return [2 /*return*/];
            });
        });
    };
    MQTTController.prototype.initialize = function () {
    };
    return MQTTController;
}());
;
var mqttController = new MQTTController();
exports.default = mqttController;
//# sourceMappingURL=mqtt.controller.js.map