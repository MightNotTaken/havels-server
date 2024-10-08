import { CalibrationBench } from "../../entity/calibration-bench/Bench";
import { CalibrationPodEntry } from "../../entity/calibration-bench/Entry";

export interface CalibrationPodInterface {
  name: string;
  stationID: number;
  bench: CalibrationBench;
  entries: CalibrationPodEntry[];
}
