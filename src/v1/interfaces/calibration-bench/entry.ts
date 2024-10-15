import { Batch } from "../../entity/calibration-bench/Batch";
import { CalibrationPod } from "../../entity/calibration-bench/Pod";

export interface CalibrationPodEntryInterface {
    barcode: string;
    date: Date;
    pod: CalibrationPod;
    batch: Batch;
    result: 'MCB_PASS'|'MCB_EARLY_TRIP'|'MCB_LATE_TRIP'|'MCB_NO_TRIP'|'MCB_INVALID_RESPONSE';
    tripTime: number;
}
