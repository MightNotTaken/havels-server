import { SPM } from "../../entity/SPM/SPM";

export interface SPMEntryInterface {
    id: number;
    date: Date;
    shift: string;
    data: string;
    spm: SPM
};