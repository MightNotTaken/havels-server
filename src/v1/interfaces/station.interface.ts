import { ShiftCount } from "../entity/ShiftCount";

export interface StationInterface {
    id: number;
    name: string;
    mac: string;
    shifts: ShiftCount[];
}