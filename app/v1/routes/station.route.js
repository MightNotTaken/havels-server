"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var station_controller_1 = __importDefault(require("../controllers/station.controller"));
var router = express_1.default.Router();
router.post("/reset-count", station_controller_1.default.resetCount);
exports.default = router;
//# sourceMappingURL=station.route.js.map