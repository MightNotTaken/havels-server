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
var Pillbox_1 = require("../entity/Pillbox");
var mqtt_controller_1 = __importDefault(require("./mqtt.controller"));
var ota_controller_1 = __importDefault(require("./ota.controller"));
var PillboxRepository = db_1.AppDataSource.getRepository(Pillbox_1.Pillbox);
var DeviceRepositories = {
    pillbox: {
        repository: PillboxRepository,
        create: function (body) { return new Pillbox_1.Pillbox(body); }
    }
};
var DeviceController = /** @class */ (function () {
    function DeviceController() {
    }
    DeviceController.prototype.add = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, mac, type, _b, repository, create, device, version, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 4, , 5]);
                        _a = req.body, mac = _a.mac, type = _a.type;
                        if (!mac || !type) {
                            return [2 /*return*/, res.status(400).json({
                                    message: 'missing parameters',
                                    expected: ['mac', 'type']
                                })];
                        }
                        if (!DeviceRepositories[type]) {
                            return [2 /*return*/, res.status(400).json({
                                    message: 'Invalid type',
                                    validOptions: Object.keys(DeviceRepositories)
                                })];
                        }
                        _b = DeviceRepositories[type], repository = _b.repository, create = _b.create;
                        return [4 /*yield*/, repository.findOne({ where: { mac: mac } })];
                    case 1:
                        device = _c.sent();
                        if (device) {
                            return [2 /*return*/, res.status(409).json({
                                    message: 'Duplicate found'
                                })];
                        }
                        return [4 /*yield*/, ota_controller_1.default.getLatestVersion(type)];
                    case 2:
                        version = _c.sent();
                        device = create({ mac: mac, type: type, currentVersion: version, newVersion: version });
                        return [4 /*yield*/, repository.save(device)];
                    case 3:
                        _c.sent();
                        res.status(200).json({
                            message: 'Device successfully created',
                            data: device
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _c.sent();
                        console.error(error_1);
                        res.status(500).send(error_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DeviceController.prototype.get = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, type, mac, relations, where, device, response, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query, type = _a.type, mac = _a.mac, relations = _a.relations;
                        if (!mac && !type) {
                            return [2 /*return*/, res.status(400).json({
                                    message: 'missing parameters',
                                    expected: ['mac', 'type']
                                })];
                        }
                        where = {};
                        if (mac) {
                            where.mac = mac;
                        }
                        if (type) {
                            where.type = type;
                        }
                        return [4 /*yield*/, DeviceRepositories[type].repository.find({
                                where: where,
                                relations: relations ? [relations] : []
                            })];
                    case 1:
                        device = _b.sent();
                        response = device;
                        if (!device) {
                            response = {
                                message: "".concat(type, " not found with mac ").concat(mac)
                            };
                        }
                        res === null || res === void 0 ? void 0 : res.status(200).send(response);
                        if (!res) {
                            return [2 /*return*/, response];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        console.error(error_2);
                        res.status(500).send(error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DeviceController.prototype.remove = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, mac, type, device, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = req.body, mac = _a.mac, type = _a.type;
                        if (!type) {
                            type = 'pillbox';
                        }
                        if (!mac) {
                            return [2 /*return*/, res.status(400).json({
                                    message: 'missing parameters',
                                    expected: ['mac']
                                })];
                        }
                        return [4 /*yield*/, DeviceRepositories[type].repository.findOne({
                                where: {
                                    mac: mac
                                },
                            })];
                    case 1:
                        device = _b.sent();
                        if (!device) {
                            res === null || res === void 0 ? void 0 : res.status(400).json({
                                mssage: "".concat(type, " not found with mac ").concat(mac)
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, DeviceRepositories[type].repository.remove(device)];
                    case 2:
                        _b.sent();
                        res.status(200).json({
                            message: "".concat(type, " with mac ").concat(mac, " removed successfully")
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _b.sent();
                        console.error(error_3);
                        res.status(500).send(error_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DeviceController.prototype.updateViles = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, mac, type, viles, device, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = req.body, mac = _a.mac, type = _a.type, viles = _a.viles;
                        if (!type) {
                            type = 'pillbox';
                        }
                        if (!mac || !viles) {
                            return [2 /*return*/, res.status(400).send({
                                    message: 'Missing parameters',
                                    expected: ['mac', "type (optional, default value 'pillbox')", 'viles (an array containing six binay digits)']
                                })];
                        }
                        if (viles.length !== 6 || !viles.every(function (v) { return v === 1 || v === 0; })) {
                            return [2 /*return*/, res.status(400).send({
                                    message: 'viles parameter mismatch',
                                    expected: 'an array containing six binary digits, like [1,1,0,0,1,1]'
                                })];
                        }
                        return [4 /*yield*/, DeviceRepositories[type].repository.findOne({
                                where: {
                                    mac: mac
                                }
                            })];
                    case 1:
                        device = _b.sent();
                        if (!device) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "".concat(type, " not found with mac ").concat(mac)
                                })];
                        }
                        device.viles = viles.join('');
                        return [4 /*yield*/, DeviceRepositories[type].repository.save(device)];
                    case 2:
                        _b.sent();
                        mqtt_controller_1.default.updateViles(mac, device.viles);
                        res.status(200).json({
                            message: 'viles successfully updated'
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _b.sent();
                        console.error(error_4);
                        res.status(500).send(error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return DeviceController;
}());
;
var deviceController = new DeviceController();
exports.default = deviceController;
//# sourceMappingURL=device.controller.js.map