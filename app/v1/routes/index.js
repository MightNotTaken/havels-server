"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var ota_route_1 = __importDefault(require("./ota.route"));
var shift_route_1 = __importDefault(require("./shift.route"));
var station_route_1 = __importDefault(require("./station.route"));
var calibration_bench_route_1 = __importDefault(require("./calibration-bench.route"));
var routes = express_1.default.Router();
routes.use("/ota", ota_route_1.default);
routes.use("/shift", shift_route_1.default);
routes.use("/station", station_route_1.default);
routes.use("/calibration-bench", calibration_bench_route_1.default);
exports.default = routes;
//# sourceMappingURL=index.js.map