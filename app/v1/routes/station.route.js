"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var station_controller_1 = __importDefault(require("../controllers/station.controller"));
var mqtt_controller_1 = __importDefault(require("../controllers/mqtt.controller"));
var router = express_1.default.Router();
router.post("/reset-count", station_controller_1.default.resetCount);
router.post("/reset-all", station_controller_1.default.resetAll);
router.post("/hourly-count", station_controller_1.default.getHourlyCount);
router.get("/raw-count", mqtt_controller_1.default.getStationData);
router.get("/raw-data", mqtt_controller_1.default.getStationRawData);
exports.default = router;
//# sourceMappingURL=station.route.js.map