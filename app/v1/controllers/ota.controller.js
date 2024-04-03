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
var express_1 = require("express");
var OTA_1 = require("../entity/OTA");
var typeorm_1 = require("typeorm");
var db_1 = require("../../db");
var OTARepository = db_1.AppDataSource.getRepository(OTA_1.OTA);
var OTAController = /** @class */ (function () {
    function OTAController() {
    }
    OTAController.prototype.getDetails = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, type, version, description, where, matches, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, type = _a.type, version = _a.version, description = _a.description;
                        if (!version && !type && !description) {
                            return [2 /*return*/, res === null || res === void 0 ? void 0 : res.status(400).json({
                                    message: 'missing parameters, provided atleast one',
                                    expected: ['version', 'type', 'description (partial match allowed)']
                                })];
                        }
                        where = {};
                        if (version) {
                            where.version = version;
                        }
                        if (type) {
                            where.type = type;
                        }
                        if (description) {
                            where.description = (0, typeorm_1.Like)("%".concat(description, "%"));
                        }
                        return [4 /*yield*/, OTARepository.find({ where: where })];
                    case 1:
                        matches = _b.sent();
                        res === null || res === void 0 ? void 0 : res.status(200).send(matches);
                        if (!express_1.response) {
                            return [2 /*return*/, matches];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        res.status(500).send(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OTAController.prototype.addNewVersion = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, version, type, description, path, firmware, newFirmware, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = req.body, version = _a.version, type = _a.type, description = _a.description, path = _a.path;
                        if (!version || !type || !description) {
                            return [2 /*return*/, res.status(400).json({
                                    message: 'missing parameters',
                                    expected: ['version', 'type', 'description']
                                })];
                        }
                        return [4 /*yield*/, OTARepository.findOne({
                                where: {
                                    version: version,
                                    type: type
                                }
                            })];
                    case 1:
                        firmware = _b.sent();
                        if (firmware) {
                            return [2 /*return*/, res.status(409).json({
                                    message: 'Duplicate firmware conflict'
                                })];
                        }
                        newFirmware = OTARepository.create({
                            version: version,
                            type: type,
                            description: description,
                            path: path
                        });
                        return [4 /*yield*/, OTARepository.save(newFirmware)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, res.status(200).send({
                                message: 'Firmware successfully uploaded',
                                data: newFirmware
                            })];
                    case 3:
                        error_2 = _b.sent();
                        res.status(500).send(error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OTAController.prototype.download = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, version, type, firmware, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query, version = _a.version, type = _a.type;
                        if (!version || !type) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "Missing parameter",
                                    expected: ["version", "type"]
                                })];
                        }
                        return [4 /*yield*/, OTARepository.findOne({
                                where: {
                                    version: version,
                                    type: type
                                }
                            })];
                    case 1:
                        firmware = _b.sent();
                        if (firmware) {
                            return [2 /*return*/, res.status(200).download(firmware.path)];
                        }
                        return [2 /*return*/, res.status(404).json({ message: "Firmware Not found" })];
                    case 2:
                        error_3 = _b.sent();
                        res.status(500).send(error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OTAController.prototype.remove = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, version, type, firmware, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        _a = req.body, version = _a.version, type = _a.type;
                        if (!version || !type) {
                            return [2 /*return*/, res.status(400).json({
                                    message: 'missing parameters',
                                    expected: ['version', 'type']
                                })];
                        }
                        return [4 /*yield*/, OTARepository.findOne({
                                where: {
                                    version: version,
                                    type: type
                                }
                            })];
                    case 1:
                        firmware = _b.sent();
                        if (!firmware) return [3 /*break*/, 3];
                        return [4 /*yield*/, OTARepository.remove(firmware)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                message: 'Ota version removed'
                            })];
                    case 3: return [2 /*return*/, res.status(404).json({ message: "Firmware Not found" })];
                    case 4:
                        error_4 = _b.sent();
                        res.status(500).send(error_4);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    OTAController.prototype.getLatestVersion = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var firmwares, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, OTARepository.find({
                                where: {
                                    type: type
                                },
                                order: {
                                    version: 'DESC'
                                }
                            })];
                    case 1:
                        firmwares = _a.sent();
                        if (firmwares && firmwares[0]) {
                            return [2 /*return*/, firmwares[0].version];
                        }
                        return [2 /*return*/, "1.0.0"];
                    case 2:
                        error_5 = _a.sent();
                        return [2 /*return*/, "1.0.0"];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return OTAController;
}());
;
var OtaController = new OTAController();
exports.default = OtaController;
//# sourceMappingURL=ota.controller.js.map