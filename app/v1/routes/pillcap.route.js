"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var pillcap_controller_1 = __importDefault(require("../controllers/pillcap.controller"));
var router = express_1.default.Router();
router.post("", pillcap_controller_1.default.getDetails);
router.get("", pillcap_controller_1.default.getDetails);
router.post("/reset", pillcap_controller_1.default.reset);
exports.default = router;
//# sourceMappingURL=pillcap.route.js.map