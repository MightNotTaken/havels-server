import { SPM } from "../../entity/SPM/SPM";

export interface SPMEntryInterface {
    id: number;
    qr: string;
    date: Date;
    rating: string;
    resistance: number;
    resistanceStatus: 'Pass'|'Fail';
    hold: number;
    holdStatus: 'Pass'|'Fail';
    trip: number;
    tripStatus: 'Pass'|'Fail';
    hvStatus: 'Pass'|'Fail';
    overallStatus: 'Pass'|'Fail';
    spm: SPM;
};