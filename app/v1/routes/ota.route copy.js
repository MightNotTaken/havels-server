"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var ota_controller_1 = __importDefault(require("../controllers/ota.controller"));
var multer_config_1 = __importDefault(require("../middlewares/multer.config"));
var router = express_1.default.Router();
router.post("", multer_config_1.default.single("firmware"), ota_controller_1.default.addNewVersion);
router.delete("", ota_controller_1.default.remove);
router.post("/find", ota_controller_1.default.getDetails);
router.get("/perform", ota_controller_1.default.download);
exports.default = router;
//# sourceMappingURL=ota.route%20copy.js.map