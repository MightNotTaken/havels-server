import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ShiftInterface } from "../interfaces/shift.interface";
import { Station } from "./Station";
import { ShiftCountInterface } from "../interfaces/shift-count.interface";
import { HourlyCountInterface } from "../interfaces/hourly-count.interface";

@Entity()
export class HourlyCount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false
  }) date: Date;

  @Column({
    default: 0
  }) hour: number;

  @Column({
    default: 0
  }) count: number;

  @ManyToOne(() => Station, (station) => station.hourlyCounts, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  station: Station;
  
  constructor(body: Partial<HourlyCountInterface>) {
    if (!body) {
      return;
    }
    this.date = body.date;
  }
}