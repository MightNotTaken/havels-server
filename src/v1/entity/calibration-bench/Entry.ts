import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CalibrationBench } from "./Bench";
import { CalibrationPod } from "./Pod";
import { CalibrationPodEntryInterface } from "../../interfaces/calibration-bench/entry";

@Entity()
export class CalibrationPodEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false
  })
  calibrationString: string;

  @Column({
    nullable: false
  })
  verificationString: string;

  @Column({
    nullable: false
  })
  shift: string;

  @Column({
    nullable: false
  })
  barcode: string;

  @Column()
  date: Date;

  @ManyToOne(() => CalibrationPod, (pod) => pod.entries, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  pod: CalibrationPod;

  constructor(body: CalibrationPodEntryInterface) {
    if (!body) {
      return;
    }
    this.calibrationString = body.calibrationString;
    this.verificationString = body.verificationString;
    this.shift = body.shift;
    this.barcode = body.barcode;
    this.pod = body.pod;
    this.date = body.date;
  }
}