import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// import { ShiftInterface } from "../interfaces/shift.interface";
// import { Station } from "./Station";
import { ShiftCountInterface } from "../interfaces/shift-count.interface";

@Entity()
export class ShiftCount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 30,
    nullable: false
  }) name: string;

  @Column({
    nullable: false
  }) date: Date;

  @Column({
    default: 0
  }) count: number;

  // @ManyToOne(() => Station, (station) => station.shifts, {
  //   orphanedRowAction: 'delete',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // station: Station;
  
  constructor(body: Partial<ShiftCountInterface>) {
    if (!body) {
      return;
    }
    this.name = body.name;
    this.date = body.date;
  }
}