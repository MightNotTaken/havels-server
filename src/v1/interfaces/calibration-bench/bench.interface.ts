import { Batch } from "../../entity/calibration-bench/Batch";
import { CalibrationPod } from "../../entity/calibration-bench/Pod";

export interface CalibrationBenchInterface {
    id: number;
    pods: CalibrationPod[];
    name: string;
    mac: string;
    batches: Batch[]
}
