import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StationInterface } from "../interfaces/station.interface";
import { HourlyCount } from "./HourlyStationCount";

@Entity()
export class Station {
  @PrimaryGeneratedColumn()
  id: number;
  
  @OneToMany(() => HourlyCount, (hc) => hc.station, {
    cascade: true,
  })
  hourlyCounts: HourlyCount[];

  @Column({
    length: 30,
    nullable: false
  }) name: string;

  @Column({
    length: 30,
    nullable: false
  }) mac: string;

  constructor(body: StationInterface) {
    if (!body) {
        return;
    }
    this.hourlyCounts = [];
    this.name = body.name;
    this.mac = body.mac;
  }
}