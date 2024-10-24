import { Batch } from "../../entity/calibration-bench/Batch";
import { CalibrationPod } from "../../entity/calibration-bench/Pod";

export interface CalibrationPodEntryInterface {
    barcode: string;
    date: Date;
    pod: CalibrationPod;
    timestamp: Date;
    batch: Batch;
    result: 'MCB_PASS'|'MCB_EARLY_TRIP'|'MCB_LATE_TRIP'|'MCB_NO_TRIP';
    tripTime: number;
}
