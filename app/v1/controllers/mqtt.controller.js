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
var mqtt_util_1 = __importDefault(require("../utils/mqtt.util"));
var Station_1 = require("../entity/Station");
var SPM_1 = require("../entity/SPM/SPM");
var Entry_1 = require("../entity/SPM/Entry");
var HourlyStationCount_1 = require("../entity/HourlyStationCount");
var Bench_1 = require("../entity/calibration-bench/Bench");
var calibration_bench_controller_1 = require("./calibration-bench.controller");
var Batch_1 = require("../entity/calibration-bench/Batch");
var Entry_2 = require("../entity/calibration-bench/Entry");
var StationRepository = db_1.AppDataSource.getTreeRepository(Station_1.Station);
var HourlyCountRepository = db_1.AppDataSource.getTreeRepository(HourlyStationCount_1.HourlyCount);
var SPMRepository = db_1.AppDataSource.getRepository(SPM_1.SPM);
var SPMEntryRepository = db_1.AppDataSource.getRepository(Entry_1.SPMEntry);
var CalBenchRepository = db_1.AppDataSource.getRepository(Bench_1.CalibrationBench);
var BatchRepository = db_1.AppDataSource.getRepository(Batch_1.Batch);
var PodEntryRepository = db_1.AppDataSource.getRepository(Entry_2.CalibrationPodEntry);
var stations = {};
var globalData = {
    date: new Date(),
    dateString: ''
};
function updateGlobalTimingParameters() {
    var date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    globalData.date = date;
    globalData.dateString = "".concat(date.getDate(), "/").concat(date.getMonth() + 1, "/").concat(date.getFullYear());
    console.log(globalData);
}
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
    MQTTController.getRawData = function () {
        var response = [];
        for (var station in stations) {
            var stationData = __assign({}, stations[station]);
            var dataObject = {
                station: stationData.displayName,
                name: stationData.name,
                id: stationData.id,
                data: []
            };
            if (stationData.data[globalData.dateString]) {
                for (var hour in stationData.data[globalData.dateString]) {
                    dataObject.data.push({
                        hour: +hour,
                        count: stationData.data[globalData.dateString][hour].current - stationData.data[globalData.dateString][hour].reference
                    });
                }
            }
            response.push(dataObject);
        }
        return response;
    };
    MQTTController.saveData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rawData, _i, rawData_1, stationData, name, id, data, _a, data_1, _b, hour, count, hourlyCount, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 11, , 12]);
                        console.log('saving data');
                        rawData = MQTTController.getRawData();
                        _i = 0, rawData_1 = rawData;
                        _c.label = 1;
                    case 1:
                        if (!(_i < rawData_1.length)) return [3 /*break*/, 10];
                        stationData = rawData_1[_i];
                        name = stationData.name, id = stationData.id, data = stationData.data;
                        _a = 0, data_1 = data;
                        _c.label = 2;
                    case 2:
                        if (!(_a < data_1.length)) return [3 /*break*/, 9];
                        _b = data_1[_a], hour = _b.hour, count = _b.count;
                        return [4 /*yield*/, HourlyCountRepository.findOne({
                                where: {
                                    station: +id,
                                    hour: +hour,
                                    date: globalData.date
                                }
                            })];
                    case 3:
                        hourlyCount = _c.sent();
                        if (!!hourlyCount) return [3 /*break*/, 5];
                        console.log("creating hourly count for ".concat(stationData.displayName, " on date ").concat(globalData.dateString, " and hour ").concat(hour));
                        return [4 /*yield*/, HourlyCountRepository.create({
                                hour: +hour,
                                date: globalData.date,
                                station: id,
                                count: +count
                            })];
                    case 4:
                        hourlyCount = _c.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        hourlyCount.count = count;
                        _c.label = 6;
                    case 6: return [4 /*yield*/, HourlyCountRepository.save(hourlyCount)];
                    case 7:
                        _c.sent();
                        _c.label = 8;
                    case 8:
                        _a++;
                        return [3 /*break*/, 2];
                    case 9:
                        _i++;
                        return [3 /*break*/, 1];
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        error_1 = _c.sent();
                        console.error("error in updating database", error_1);
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    MQTTController.prototype.getStationData = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                try {
                    response = MQTTController.getRawData();
                    res.status(200).json(response);
                }
                catch (error) {
                    console.error(error);
                    res.status(500).json({
                        message: 'internal server error'
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    MQTTController.prototype.getStationRawData = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    res.status(200).json(stations);
                }
                catch (error) {
                    console.error(error);
                    res.status(500).json({
                        message: 'internal server error'
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    MQTTController.prototype.registerDeviceEvents = function () {
        var _this = this;
        mqtt_util_1.default.listen('connect', function (data) { return __awaiter(_this, void 0, void 0, function () {
            var _a, mac, station;
            var _b;
            return __generator(this, function (_c) {
                try {
                    _a = JSON.parse(data), mac = _a.mac, station = _a.station;
                    console.log('connection', { mac: mac, station: station });
                    (_b = this.client) === null || _b === void 0 ? void 0 : _b.publish("".concat(mac, "/utc"), this.getTime() + '_' + this.getDate());
                }
                catch (error) {
                    console.error(error);
                }
                return [2 /*return*/];
            });
        }); });
        mqtt_util_1.default.listen("spm:connect", function (data) { return __awaiter(_this, void 0, void 0, function () {
            var _a, mac_1, station, spm_1, error_2;
            var _this = this;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 7, , 8]);
                        _a = JSON.parse(data), mac_1 = _a.mac, station = _a.station;
                        return [4 /*yield*/, SPMRepository.findOne({ where: { mac: mac_1 } })];
                    case 1:
                        spm_1 = _c.sent();
                        if (!!spm_1) return [3 /*break*/, 4];
                        return [4 /*yield*/, SPMRepository.create({ mac: mac_1, name: station })];
                    case 2:
                        spm_1 = _c.sent();
                        return [4 /*yield*/, SPMRepository.save(spm_1)];
                    case 3:
                        _c.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        if (!(spm_1.name !== station)) return [3 /*break*/, 6];
                        return [4 /*yield*/, SPMRepository.update(spm_1, { name: station })];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6:
                        setTimeout(function () {
                            var _a;
                            (_a = _this.client) === null || _a === void 0 ? void 0 : _a.publish("".concat(mac_1, "/id"), "".concat(spm_1.id));
                        }, 400);
                        (_b = this.client) === null || _b === void 0 ? void 0 : _b.publish("".concat(mac_1, "/utc"), this.getTime() + '_' + this.getDate());
                        return [3 /*break*/, 8];
                    case 7:
                        error_2 = _c.sent();
                        console.error(error_2);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        }); });
        mqtt_util_1.default.listen("spm:data", function (data) { return __awaiter(_this, void 0, void 0, function () {
            var _a, id, qr, rating, resistance, resistanceStatus, hold, holdStatus, trip, tripStatus, hvStatus, overallStatus, spm, entry, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        _a = JSON.parse(data), id = _a[0], qr = _a[1], rating = _a[2], resistance = _a[3], resistanceStatus = _a[4], hold = _a[5], holdStatus = _a[6], trip = _a[7], tripStatus = _a[8], hvStatus = _a[9], overallStatus = _a[10];
                        resistanceStatus = resistanceStatus ? 'Pass' : 'Fail';
                        holdStatus = holdStatus ? 'Pass' : 'Fail';
                        tripStatus = tripStatus ? 'Pass' : 'Fail';
                        hvStatus = hvStatus ? 'Pass' : 'Fail';
                        overallStatus = overallStatus ? 'Pass' : 'Fail';
                        return [4 /*yield*/, SPMRepository.findOne({ where: { id: +id } })];
                    case 1:
                        spm = _b.sent();
                        if (!spm) return [3 /*break*/, 4];
                        return [4 /*yield*/, SPMEntryRepository.create({
                                qr: qr,
                                rating: rating,
                                resistance: resistance,
                                resistanceStatus: resistanceStatus,
                                hold: hold,
                                holdStatus: holdStatus,
                                trip: trip,
                                tripStatus: tripStatus,
                                hvStatus: hvStatus,
                                overallStatus: overallStatus,
                                spm: spm,
                                date: new Date()
                            })];
                    case 2:
                        entry = _b.sent();
                        return [4 /*yield*/, SPMEntryRepository.save(entry)];
                    case 3:
                        _b.sent();
                        console.log(entry);
                        _b.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_3 = _b.sent();
                        console.error(error_3);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
        mqtt_util_1.default.listen("hourly-station-count", function (data) { return __awaiter(_this, void 0, void 0, function () {
            var _a, hour, stationName, count, mac, station, error_4;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 6, , 7]);
                        console.log(data);
                        _a = JSON.parse(data), hour = _a[0], stationName = _a[1], count = _a[2], mac = _a[3];
                        if (!!stations[stationName]) return [3 /*break*/, 5];
                        return [4 /*yield*/, StationRepository.findOne({
                                where: {
                                    name: stationName
                                }
                            })];
                    case 1:
                        station = _c.sent();
                        if (!!station) return [3 /*break*/, 4];
                        return [4 /*yield*/, StationRepository.create({
                                name: stationName,
                                mac: mac
                            })];
                    case 2:
                        station = _c.sent();
                        return [4 /*yield*/, StationRepository.save(station)];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        ;
                        station.lastUpdate = new Date();
                        stations[stationName] = __assign({}, station);
                        stations[stationName].data = {};
                        _c.label = 5;
                    case 5:
                        if (!stations[stationName].data[globalData.dateString]) {
                            stations[stationName].data[globalData.dateString] = {};
                        }
                        if (!stations[stationName].data[globalData.dateString][hour]) {
                            stations[stationName].data[globalData.dateString][hour] = {
                                reference: count,
                                current: count
                            };
                        }
                        else {
                            stations[stationName].data[globalData.dateString][hour].current = count;
                        }
                        stations[stationName].lastUpdate = new Date();
                        if (+hour != (new Date()).getHours()) {
                            console.log(hour, (new Date()).getHours());
                            console.log('updating time');
                            (_b = this.client) === null || _b === void 0 ? void 0 : _b.publish("".concat(mac, "/utc"), this.getTime() + '_' + this.getDate());
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        error_4 = _c.sent();
                        console.error(error_4);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
        mqtt_util_1.default.listen("calib:connect", function (data) { return __awaiter(_this, void 0, void 0, function () {
            var _a, mac_2, name, bench_1, error_5;
            var _this = this;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        _a = JSON.parse(data), mac_2 = _a.mac, name = _a.name;
                        return [4 /*yield*/, CalBenchRepository.findOne({ where: { mac: mac_2 } })];
                    case 1:
                        bench_1 = _c.sent();
                        if (!bench_1) {
                            bench_1 = calibration_bench_controller_1.CalibrationBenchController.createBench({ name: name, mac: mac_2 });
                        }
                        bench_1.mac = mac_2;
                        return [4 /*yield*/, CalBenchRepository.save(bench_1)];
                    case 2:
                        _c.sent();
                        console.log(bench_1);
                        (_b = this.client) === null || _b === void 0 ? void 0 : _b.publish("".concat(mac_2, "/utc"), this.getTime() + '_' + this.getDate());
                        setTimeout(function () {
                            var _a;
                            (_a = _this.client) === null || _a === void 0 ? void 0 : _a.publish("".concat(mac_2, "/bench-id"), "".concat(bench_1.id));
                        }, 500);
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _c.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        mqtt_util_1.default.listen("calib:batch-params", function (rawData) { return __awaiter(_this, void 0, void 0, function () {
            var _a, mac, mode, rating, current, ambient, t1, t2, t3, t4, bench, batch, error_6;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 6, , 7]);
                        _a = JSON.parse(rawData), mac = _a[0], mode = _a[1], rating = _a[2], current = _a[3], ambient = _a[4], t1 = _a[5], t2 = _a[6], t3 = _a[7], t4 = _a[8];
                        current = +current;
                        ambient = +ambient;
                        t1 = +t1;
                        t2 = +t2;
                        t3 = +t3;
                        t4 = +t4;
                        console.log({ mac: mac, mode: mode, rating: rating, current: current, ambient: ambient, t1: t1, t2: t2, t3: t3, t4: t4 });
                        return [4 /*yield*/, CalBenchRepository.findOne({
                                where: {
                                    mac: mac
                                }
                            })];
                    case 1:
                        bench = _c.sent();
                        return [4 /*yield*/, BatchRepository.findOne({
                                where: {
                                    mode: mode,
                                    rating: rating,
                                    current: current,
                                    t1: t1,
                                    t2: t2,
                                    t3: t3,
                                    t4: t4,
                                    bench: bench.id
                                }
                            })];
                    case 2:
                        batch = _c.sent();
                        if (!!batch) return [3 /*break*/, 5];
                        return [4 /*yield*/, BatchRepository.create({
                                mode: mode,
                                rating: rating,
                                current: current,
                                ambient: ambient,
                                t1: t1,
                                t2: t2,
                                t3: t3,
                                t4: t4,
                                bench: bench,
                                timestamp: new Date()
                            })];
                    case 3:
                        batch = _c.sent();
                        return [4 /*yield*/, BatchRepository.save(batch)];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        (_b = this.client) === null || _b === void 0 ? void 0 : _b.publish("".concat(mac, "/batch-id"), "".concat(batch.id));
                        return [3 /*break*/, 7];
                    case 6:
                        error_6 = _c.sent();
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
        mqtt_util_1.default.listen("calib:data", function (rawData) { return __awaiter(_this, void 0, void 0, function () {
            var _a, barcode, batchID, benchID, triptTime, stationID, result, batch, bench, entry, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        _a = JSON.parse(rawData), barcode = _a[0], batchID = _a[1], benchID = _a[2], triptTime = _a[3], stationID = _a[4], result = _a[5];
                        console.log({ batchID: batchID, benchID: benchID, triptTime: triptTime, stationID: stationID, result: result });
                        result = [null, 'MCB_PASS', 'MCB_EARLY_TRIP', 'MCB_LATE_TRIP', 'MCB_NO_TRIP'][result];
                        return [4 /*yield*/, BatchRepository.findOne({ where: { id: +batchID } })];
                    case 1:
                        batch = _b.sent();
                        return [4 /*yield*/, CalBenchRepository.findOne({ where: { id: +benchID }, relations: ['pods'] })];
                    case 2:
                        bench = _b.sent();
                        if (!(batch && bench.pods[stationID - 1])) return [3 /*break*/, 5];
                        return [4 /*yield*/, PodEntryRepository.create({
                                barcode: barcode,
                                tripTime: +triptTime,
                                result: result,
                                pod: bench.pods[stationID - 1],
                                batch: batch,
                                timestamp: new Date()
                            })];
                    case 3:
                        entry = _b.sent();
                        return [4 /*yield*/, PodEntryRepository.save(entry)];
                    case 4:
                        _b.sent();
                        console.log(entry);
                        _b.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_7 = _b.sent();
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
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
        updateGlobalTimingParameters();
        setInterval(function () {
            updateGlobalTimingParameters();
            MQTTController.saveData();
        }, 10000);
    };
    return MQTTController;
}());
;
var mqttController = new MQTTController();
exports.default = mqttController;
//# sourceMappingURL=mqtt.controller.js.map