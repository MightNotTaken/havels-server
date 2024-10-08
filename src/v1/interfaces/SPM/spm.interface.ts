import { SPMEntry } from "../../entity/SPM/Entry";

export interface SPMInterface {
    id: number;
    mac: string;
    name: string;
    entries: SPMEntry[]
}