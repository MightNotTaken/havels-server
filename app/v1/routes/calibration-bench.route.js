"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var calibration_bench_controller_1 = __importDefault(require("../controllers/calibration-bench.controller"));
var router = express_1.default.Router();
router.post("/begin", calibration_bench_controller_1.default.initialize);
exports.default = router;
//# sourceMappingURL=calibration-bench.route.js.map