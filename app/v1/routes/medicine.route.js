"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var medicine_controller_1 = __importDefault(require("../controllers/medicine.controller"));
var router = express_1.default.Router();
router.post("", medicine_controller_1.default.add);
router.delete("", medicine_controller_1.default.remove);
exports.default = router;
//# sourceMappingURL=medicine.route.js.map