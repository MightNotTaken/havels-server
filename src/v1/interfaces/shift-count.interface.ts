import { Station } from "../entity/Station";

export interface ShiftCountInterface {
    id: number;
    station: Station;
    count: number;
    date: Date;
    name: string;
}