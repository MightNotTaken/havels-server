import { SPM } from "../../entity/SPM/SPM";

export interface SPMEntryInterface {
    id: number;
    qr: string;
    date: Date;
    rating: string;
    resistance: number;
    resistanceStauts: number;
    hold: number;
    holdStauts: number;
    trip: number;
    tripStauts: number;
    hvStatus: number;
    overallStatus: number;
    spm: SPM;  
};