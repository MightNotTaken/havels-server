"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var multer_1 = __importDefault(require("multer"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        req.body = req.query;
        var _a = req.query, type = _a.type, version = _a.version;
        var folderName = path_1.default.join(__dirname, "../../../OTA-binaries", type, version);
        if (!fs_1.default.existsSync(folderName)) {
            fs_1.default.mkdirSync(folderName, {
                recursive: true
            });
        }
        req.body.path = folderName;
        cb(null, folderName);
    },
    filename: function (req, file, cb) {
        req.body.path = path_1.default.join(req.body.path, 'firmware.bin');
        cb(null, 'firmware.bin');
    },
});
var fileFilter = function (req, file, cb) {
    if (!file) {
        return cb(null, true);
    }
    if (file.mimetype === "application/octet-stream") {
        cb(null, true); // Allow the upload.
    }
    else {
        cb(new Error("Invalid file type. Only binary files are allowed."));
    }
};
var upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
});
exports.default = upload;
//# sourceMappingURL=multer.config.js.map