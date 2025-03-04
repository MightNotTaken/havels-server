"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(require("ws"));
var rxjs_1 = require("rxjs");
var WSUtil = /** @class */ (function () {
    function WSUtil() {
        this.wss = null;
        this.dataPipelines = {
            'ps': new rxjs_1.BehaviorSubject(null),
            'calib': new rxjs_1.BehaviorSubject(null),
            'spm': new rxjs_1.BehaviorSubject(null)
        };
    }
    WSUtil.prototype.getTime = function () {
        var date = new Date();
        var hours = String(date.getHours()).padStart(2, '0');
        var minutes = String(date.getMinutes()).padStart(2, '0');
        var seconds = String(date.getSeconds()).padStart(2, '0');
        return hours + ':' + minutes + ':' + seconds;
    };
    WSUtil.prototype.getDate = function () {
        var date = new Date();
        var year = String(date.getFullYear());
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var day = String(date.getDate()).padStart(2, '0');
        return year + '/' + month + '/' + day;
    };
    WSUtil.prototype.init = function (server) {
        var _this = this;
        this.wss = new ws_1.default.Server({ server: server });
        this.wss.on('connection', function (ws) {
            console.log('Client connected');
            ws.send(JSON.stringify({
                event: 'utc',
                data: _this.getDate() + ' ' + _this.getTime()
            }));
            ws.on('message', function (message) {
                try {
                    var _a = JSON.parse(message), event = _a.event, data = _a.data;
                    _this.dataPipelines[event].next(data);
                }
                catch (error) {
                    console.error(error);
                }
            });
            ws.on('close', function () {
                console.log('Client disconnected');
            });
        });
        if (this.wss) {
            console.log('websocket server initialized');
        }
    };
    return WSUtil;
}());
var wsUtil = new WSUtil();
exports.default = wsUtil;
//# sourceMappingURL=ws.util.js.map