export interface StationInterface {
    id: number;
    name: string;
    mac: string;
    referenceCount: number;
    currentCount: number;
    lastUpdate: Date;
}