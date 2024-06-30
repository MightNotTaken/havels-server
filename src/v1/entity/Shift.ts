import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ShiftInterface } from "../interfaces/shift.interface";

@Entity()
export class Shift {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 10,
    nullable: false
  }) start: string;

  @Column({
    length: 10,
    nullable: false
  }) end: string;

  @Column({
    nullable: false,
    length: 30
  }) name: string;

  constructor(body: Partial<ShiftInterface>) {
    if (!body) {
      return;
    }
    this.start = body.start;
    this.end = body.end;
    this.name = body.name;
  }
}