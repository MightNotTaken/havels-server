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
    default: 'Pass'
  })
  resistanceStatus: 'Pass'|'Fail';

  @Column({
    type: 'float'
  })
  hold: number;

  @Column({
    default: 'Pass'
  })
  holdStatus: 'Pass'|'Fail';

  @Column({
    type: 'float'
  })
  trip: number;

  @Column({
    default: 'Pass'
  })
  tripStatus: 'Pass'|'Fail';

  @Column({
    default: 'Pass'
  })
  hvStatus: 'Pass'|'Fail';

  @Column({
    default: 'Pass'
  })
  overallStatus: 'Pass'|'Fail';

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
    this.resistanceStatus = body.resistanceStatus;
    this.hold = body.hold;
    this.holdStatus = body.holdStatus;
    this.trip = body.trip;
    this.tripStatus = body.tripStatus;
    this.hvStatus = body.hvStatus;
    this.overallStatus = body.overallStatus;
    this.spm = body.spm;
    this.date = body.date;
    console.log('this', this)
  }
}