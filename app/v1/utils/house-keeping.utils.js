"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateStamp = void 0;
var getDateStamp = function (date) {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');
    return "".concat(year, "-").concat(month, "-").concat(day);
};
exports.getDateStamp = getDateStamp;
//# sourceMappingURL=house-keeping.utils.js.map