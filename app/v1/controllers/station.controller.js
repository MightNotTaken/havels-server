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
var Station_1 = require("../entity/Station");
var house_keeping_utils_1 = require("../utils/house-keeping.utils");
var mqtt_controller_1 = __importDefault(require("./mqtt.controller"));
var StationRepository = db_1.AppDataSource.getRepository(Station_1.Station);
var StationController = /** @class */ (function () {
    function StationController() {
    }
    StationController.prototype.getStations = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var stations, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, StationRepository.find()];
                    case 1:
                        stations = _a.sent();
                        res.status(200).json(stations);
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
    StationController.prototype.resetCount = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, station, shift_1, count, date_1, currentStation, shiftCount, response, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        _b = req.body, station = _b.station, shift_1 = _b.shift, count = _b.count;
                        if (!station || !shift_1) {
                            return [2 /*return*/, res.status(400).send({
                                    message: 'missing parameters',
                                    expected: ['station', 'shift', 'count (optional, default value 0)']
                                })];
                        }
                        if (!count) {
                            count = 0;
                        }
                        date_1 = new Date();
                        date_1.setHours(0, 0, 0, 0);
                        return [4 /*yield*/, StationRepository.findOne({
                                where: {
                                    name: station
                                },
                                relations: ['shifts']
                            })];
                    case 1:
                        currentStation = _c.sent();
                        if (!currentStation) {
                            return [2 /*return*/, res.status(400).send({
                                    message: 'No station found with name ' + station
                                })];
                        }
                        shiftCount = (_a = currentStation.shifts) === null || _a === void 0 ? void 0 : _a.filter(function (sft) { return (0, house_keeping_utils_1.getDateStamp)(sft.date) == (0, house_keeping_utils_1.getDateStamp)(date_1) && sft.name == shift_1; })[0];
                        if (!shiftCount) {
                            return [2 /*return*/, res.status(400).send({
                                    message: 'No shift-count found with name ' + shift_1
                                })];
                        }
                        shiftCount.count = count;
                        response = {};
                        response[shift_1] = shiftCount.count;
                        response.station = station;
                        response.current = shift_1;
                        mqtt_controller_1.default.client.publish("".concat(currentStation.mac, "/reset-count"), JSON.stringify(response));
                        return [4 /*yield*/, StationRepository.save(currentStation)];
                    case 2:
                        _c.sent();
                        res.status(200).send({
                            message: 'Shift ' + shift_1 + ' for station ' + station + ' count set to ' + count,
                            data: currentStation
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _c.sent();
                        res.status(500).send(error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return StationController;
}());
;
var stationController = new StationController();
exports.default = stationController;
//# sourceMappingURL=station.controller.js.map