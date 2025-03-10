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
    length: 50,
    nullable: false
  }) name: string;

  @Column({
    length: 50,
    default: ''
  })
  displayName: string;

  @Column({
    length: 30,
    nullable: false
  }) mac: string;

  @Column({
    default: 0
  }) referenceCount: number;

  @Column({
    default: 0
  }) currentCount: number;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  }) lastUpdate: Date;

  constructor(body: StationInterface) {
    if (!body) {
        return;
    }
    this.hourlyCounts = [];
    this.name = body.name;
    this.mac = body.mac;
  }
}