import { HourlyCount } from "./HourlyStationCount";
import { OTA } from "./OTA";
import { SPMEntry } from "./SPM/Entry";
import { SPM } from "./SPM/SPM";
import { Station } from "./Station";
import { Batch } from "./calibration-bench/Batch";
import { CalibrationBench } from "./calibration-bench/Bench";
import { CalibrationPodEntry } from "./calibration-bench/Entry";
import { CalibrationPod } from "./calibration-bench/Pod";

export const entities = [
    OTA,
    Station,
    CalibrationBench,
    CalibrationPod,
    Batch,
    CalibrationPodEntry,
    HourlyCount,
    SPM,
    SPMEntry
];

