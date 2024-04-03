"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var shift_controller_1 = __importDefault(require("../controllers/shift.controller"));
var router = express_1.default.Router();
router.get("", shift_controller_1.default.getShifts);
router.post("", shift_controller_1.default.addShift);
router.post("/publish", shift_controller_1.default.publish);
router.delete("", shift_controller_1.default.remove);
router.post("/reset-count", shift_controller_1.default.resetCount);
exports.default = router;
//# sourceMappingURL=shift.route%20copy.js.map