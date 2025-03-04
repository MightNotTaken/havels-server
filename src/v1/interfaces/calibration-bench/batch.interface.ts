import { CalibrationBench } from "../../entity/calibration-bench/Bench";

export interface BatchInterface {
    id: number;
    mode: "cal" | "ver";
    rating: string;
    current: number;
    ambient: number;
    t1: number;
    t2: number;
    t3: number;
    t4: number;
    timestamp: Date;
    bench: CalibrationBench;
    displayName: string;
};
