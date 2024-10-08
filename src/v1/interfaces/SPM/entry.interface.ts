import { SPM } from "../../entity/SPM/SPM";

export interface SPMEntryInterface {
    id: number;
    qr: string;
    date: Date;
    rating: string;
    resistance: number;
    resistanceStauts: boolean;
    hold: number;
    holdStauts: boolean;
    trip: number;
    tripStauts: boolean;
    hvStatus: boolean;
    overallStatus: boolean;
    spm: SPM;  
};