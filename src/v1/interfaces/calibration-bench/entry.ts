import { Batch } from "../../entity/calibration-bench/Batch";
import { CalibrationPod } from "../../entity/calibration-bench/Pod";

export interface CalibrationPodEntryInterface {
    barcode: string;
    date: Date;
    pod: CalibrationPod;
    batch: Batch;
    result: boolean;
    tripTime: number;
}
