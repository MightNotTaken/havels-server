"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var routes_1 = __importDefault(require("./routes"));
var mqtt_controller_1 = __importDefault(require("./controllers/mqtt.controller"));
mqtt_controller_1.default.initialize();
var router = express_1.default.Router();
router.use("/v1", routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map