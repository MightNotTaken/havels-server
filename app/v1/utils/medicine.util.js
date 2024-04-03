"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MedicineService = /** @class */ (function () {
    function MedicineService() {
    }
    MedicineService.prototype.toString = function (medicine) {
        return "m-".concat(medicine.repeat, "-").concat(medicine.reference, ",").concat(medicine.vile, ",").concat(medicine.pills, "_").concat(medicine.time);
    };
    return MedicineService;
}());
;
var medicineService = new MedicineService();
exports.default = medicineService;
//# sourceMappingURL=medicine.util.js.map