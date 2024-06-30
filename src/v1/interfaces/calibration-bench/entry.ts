import { CalibrationPod } from "../../entity/calibration-bench/Pod";

export interface CalibrationPodEntryInterface {
    calibrationString: string;
    verificationString: string;
    shift: string;
    barcode: string;
    date: Date;
    pod: CalibrationPod;
}