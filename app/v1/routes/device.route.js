"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var device_controller_1 = __importDefault(require("../controllers/device.controller"));
var router = express_1.default.Router();
router.post("", device_controller_1.default.add);
router.get("", device_controller_1.default.get);
router.delete("", device_controller_1.default.remove);
router.post("/set-vile-status", device_controller_1.default.updateViles);
exports.default = router;
//# sourceMappingURL=device.route.js.map