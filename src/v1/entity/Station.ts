import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ShiftCount } from "./ShiftCount";
import { StationInterface } from "../interfaces/station.interface";

@Entity()
export class Station {
  @PrimaryGeneratedColumn()
  id: number;
  
  @OneToMany(() => ShiftCount, (sc) => sc.station, {
    cascade: true,
  })
  shifts: ShiftCount[];

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
    this.shifts = [];
    this.name = body.name;
    this.mac = body.mac;
  }
}