import { HourlyCount } from "./HourlyStationCount";
import { OTA } from "./OTA";
import { SPMEntry } from "./SPM/Entry";
import { SPM } from "./SPM/SPM";
import { Shift } from "./Shift";
import { ShiftCount } from "./ShiftCount";
import { Station } from "./Station";
import { CalibrationBench } from "./calibration-bench/Bench";
import { CalibrationPodEntry } from "./calibration-bench/Entry";
import { CalibrationPod } from "./calibration-bench/Pod";

export const entities = [
    OTA,
    Shift,
    ShiftCount,
    Station,
    CalibrationBench,
    CalibrationPod,
    CalibrationPodEntry,
    HourlyCount,
    SPM,
    SPMEntry
];

