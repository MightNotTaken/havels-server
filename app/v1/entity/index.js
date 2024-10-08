"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entities = void 0;
var HourlyStationCount_1 = require("./HourlyStationCount");
var OTA_1 = require("./OTA");
var Entry_1 = require("./SPM/Entry");
var SPM_1 = require("./SPM/SPM");
var Station_1 = require("./Station");
var Batch_1 = require("./calibration-bench/Batch");
var Bench_1 = require("./calibration-bench/Bench");
var Entry_2 = require("./calibration-bench/Entry");
var Pod_1 = require("./calibration-bench/Pod");
exports.entities = [
    OTA_1.OTA,
    Station_1.Station,
    Bench_1.CalibrationBench,
    Pod_1.CalibrationPod,
    Batch_1.Batch,
    Entry_2.CalibrationPodEntry,
    HourlyStationCount_1.HourlyCount,
    SPM_1.SPM,
    Entry_1.SPMEntry
];
//# sourceMappingURL=index.js.map