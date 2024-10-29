import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SPM } from "./SPM";
import { SPMEntryInterface } from "../../interfaces/SPM/entry.interface";

@Entity()
export class SPMEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  qr: string;


  @Column()
  date: Date;

  @Column()
  rating: string;

  @Column({
    type: 'float'
  })
  resistance: number;

  @Column({
  })
  resistanceStauts: number;

  @Column({
    type: 'float'
  })
  hold: number;

  @Column({
  })
  holdStauts: number;

  @Column({
    type: 'float'
  })
  trip: number;

  @Column({
  })
  tripStauts: number;

  @Column({
  })
  hvStatus: number;

  @Column({
  })
  overallStatus: number;

  @ManyToOne(() => SPM, (spm) => spm.entries, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  spm: SPM;

  constructor(body: Partial<SPMEntryInterface>) {
    if (!body) {
      return;
    }    
    this.qr = body.qr;
    this.rating = body.rating;
    this.resistance = body.resistance;
    this.resistanceStauts = body.resistanceStauts;
    this.hold = body.hold;
    this.holdStauts = body.holdStauts;
    this.trip = body.trip;
    this.tripStauts = body.tripStauts;
    this.hvStatus = body.hvStatus;
    this.overallStatus = body.overallStatus;
    this.spm = body.spm;
    this.date = body.date;
    console.log('this', this)
  }
}