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
var Pillbox_1 = require("../entity/Pillbox");
var Medicine_1 = require("../entity/Medicine");
var mqtt_controller_1 = __importDefault(require("./mqtt.controller"));
var typeorm_1 = require("typeorm");
var MedicineRepository = db_1.AppDataSource.getRepository(Medicine_1.Medicine);
var PillboxRepository = db_1.AppDataSource.getRepository(Pillbox_1.Pillbox);
var DeviceRepositories = {
    pillbox: {
        repository: PillboxRepository
    }
};
var MedicineController = /** @class */ (function () {
    function MedicineController() {
    }
    MedicineController.prototype.add = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var medicines, errors, response, _loop_1, _i, medicines_1, med, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        medicines = req.body;
                        if (!Array.isArray(medicines)) {
                            medicines = [medicines];
                        }
                        if (!(medicines === null || medicines === void 0 ? void 0 : medicines.length) || !medicines[0]) {
                            return [2 /*return*/, res.status(400).json({
                                    message: 'missing parameters',
                                    expected: [
                                        'mac',
                                        'type (device type)',
                                        'time',
                                        'vile',
                                        'pills',
                                        'repeat (optional)',
                                        'reference (id of the medicine in your database)'
                                    ],
                                    details: 'array of medicines is also accepted'
                                })];
                        }
                        errors = [];
                        response = [];
                        _loop_1 = function (med) {
                            var mac, type, time, vile, pills, repeat, reference, device, body, medicine;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        mac = med.mac, type = med.type, time = med.time, vile = med.vile, pills = med.pills, repeat = med.repeat, reference = med.reference;
                                        if (!mac || !time || !vile || !pills || !repeat || !reference) {
                                            errors.push({
                                                message: 'missing parameters',
                                                expected: [
                                                    'mac',
                                                    'type (device type)',
                                                    'time',
                                                    'vile',
                                                    'pills',
                                                    'repeat (optional)',
                                                    'reference (id of the medicine in your database)'
                                                ]
                                            });
                                            return [2 /*return*/, "continue"];
                                        }
                                        time = mqtt_controller_1.default.formatTimeStamp(time);
                                        if (!DeviceRepositories[type]) {
                                            errors.push({
                                                message: 'Invalid device type',
                                                reference: reference,
                                                validOptions: Object.keys(DeviceRepositories)
                                            });
                                            return [2 /*return*/, "continue"];
                                        }
                                        return [4 /*yield*/, DeviceRepositories[type].repository.findOne({
                                                where: {
                                                    mac: mac
                                                }
                                            })];
                                    case 1:
                                        device = _b.sent();
                                        if (!device) {
                                            errors.push({
                                                message: "No ".concat(type, " found with mac ").concat(mac)
                                            });
                                            return [2 /*return*/, "continue"];
                                        }
                                        body = { time: time, vile: vile, pills: pills, repeat: repeat, reference: reference, device: device };
                                        if (mqtt_controller_1.default.getUTCTime() > time) {
                                            errors.push({
                                                message: 'invalid time',
                                                reference: reference,
                                                details: 'Time should be greater than ' + mqtt_controller_1.default.getUTCTime()
                                            });
                                            return [2 /*return*/, "continue"];
                                        }
                                        return [4 /*yield*/, MedicineRepository.findOne({
                                                where: {
                                                    reference: reference
                                                }
                                            })];
                                    case 2:
                                        medicine = _b.sent();
                                        if (!medicine) return [3 /*break*/, 4];
                                        return [4 /*yield*/, MedicineRepository.update(medicine, body)];
                                    case 3:
                                        _b.sent();
                                        response.push(body);
                                        medicine = __assign(__assign({}, medicine), body);
                                        mqtt_controller_1.default.removeMedicine(device.mac, [medicine.reference]);
                                        return [3 /*break*/, 6];
                                    case 4:
                                        medicine = new Medicine_1.Medicine(body);
                                        return [4 /*yield*/, MedicineRepository.save(medicine)];
                                    case 5:
                                        _b.sent();
                                        response.push(medicine);
                                        _b.label = 6;
                                    case 6:
                                        setTimeout(function () {
                                            mqtt_controller_1.default.publishMedicine(device.mac, [medicine], 0);
                                        }, 2000);
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, medicines_1 = medicines;
                        _a.label = 1;
                    case 1:
                        if (!(_i < medicines_1.length)) return [3 /*break*/, 4];
                        med = medicines_1[_i];
                        return [5 /*yield**/, _loop_1(med)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        res.status(200).json({
                            message: 'Medicine added',
                            data: response,
                            errors: errors
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        res.status(500).send({
                            message: 'Internal server error'
                        });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    MedicineController.prototype.remove = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var reference, medicines, medsToRemove, _i, medicines_2, medicine, mac, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        reference = req.body.reference;
                        if (!reference) {
                            return [2 /*return*/, res.status(400).json({
                                    message: 'missing parameters',
                                    expected: [
                                        'reference (id of the medicine in your database)'
                                    ]
                                })];
                        }
                        if (!Array.isArray(reference)) {
                            reference = [reference];
                        }
                        return [4 /*yield*/, MedicineRepository.find({
                                where: {
                                    reference: (0, typeorm_1.In)(reference)
                                },
                                relations: [
                                    'device'
                                ]
                            })];
                    case 1:
                        medicines = _a.sent();
                        if (!(medicines === null || medicines === void 0 ? void 0 : medicines.length)) {
                            return [2 /*return*/, res.status(409).json({
                                    message: "No medicine found with reference ".concat(reference.join(', '))
                                })];
                        }
                        medsToRemove = {};
                        for (_i = 0, medicines_2 = medicines; _i < medicines_2.length; _i++) {
                            medicine = medicines_2[_i];
                            if (!medsToRemove[medicine.device.mac]) {
                                medsToRemove[medicine.device.mac] = [medicine.reference];
                            }
                            else {
                                medsToRemove[medicine.device.mac].push(medicine.reference);
                            }
                        }
                        for (mac in medsToRemove) {
                            mqtt_controller_1.default.removeMedicine(mac, medsToRemove[mac]);
                        }
                        return [4 /*yield*/, MedicineRepository.remove(medicines)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, res.status(200).send({
                                message: "Medicine removed"
                            })];
                    case 3:
                        error_2 = _a.sent();
                        res.status(500).send({
                            message: 'Internal server error'
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return MedicineController;
}());
;
var medicineController = new MedicineController();
exports.default = medicineController;
//# sourceMappingURL=medicine.controller.js.map