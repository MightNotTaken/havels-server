import { SPMEntry } from "../../entity/SPM/Entry";

export interface SPMInterface {
    id: number;
    name: string;
    entries: SPMEntry[]
}