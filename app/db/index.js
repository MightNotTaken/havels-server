"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDB = exports.AppDataSource = void 0;
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var entity_1 = require("../v1/entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: process.env.DB_TYPE || 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: process.env.DB_SYNCHRONIZE === "true",
    logging: process.env.DB_LOGGING === "true",
    entities: entity_1.entities,
    migrations: [],
    subscribers: [],
});
var createDatabaseIfNotExists = function () {
    return new Promise(function (res, rej) { return __awaiter(void 0, void 0, void 0, function () {
        var connectionOptions, tempConnection, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    console.log('creating database');
                    connectionOptions = __assign(__assign({}, exports.AppDataSource.options), { database: undefined });
                    tempConnection = new typeorm_1.DataSource(connectionOptions);
                    return [4 /*yield*/, tempConnection.initialize()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, tempConnection.query("CREATE DATABASE ".concat(process.env.DB_DATABASE))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, tempConnection.destroy()];
                case 3:
                    _a.sent();
                    res(true);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    res(false);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
};
var initializeDB = function () {
    return new Promise(function (res, rej) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, error_2, databaseCreated, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 6]);
                    _a = res;
                    return [4 /*yield*/, exports.AppDataSource.initialize()];
                case 1:
                    _a.apply(void 0, [_c.sent()]);
                    return [3 /*break*/, 6];
                case 2:
                    error_2 = _c.sent();
                    if (!(error_2.code === 'ER_BAD_DB_ERROR')) return [3 /*break*/, 5];
                    console.log('database does not exist');
                    return [4 /*yield*/, createDatabaseIfNotExists()];
                case 3:
                    databaseCreated = _c.sent();
                    if (!databaseCreated) return [3 /*break*/, 5];
                    _b = res;
                    return [4 /*yield*/, (0, exports.initializeDB)()];
                case 4: return [2 /*return*/, _b.apply(void 0, [_c.sent()])];
                case 5:
                    rej(error_2);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); });
};
exports.initializeDB = initializeDB;
//# sourceMappingURL=index.js.map