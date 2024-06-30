import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CalibrationBench } from "./Bench";
import { CalibrationPodInterface } from "../../interfaces/calibration-bench/pod.interface";
import { CalibrationPodEntry } from "./Entry";

@Entity()
export class CalibrationPod {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({
    length: 10
  })
  name: string;

  @ManyToOne(() => CalibrationBench, (bench) => bench.pods, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  bench: CalibrationBench;

  @OneToMany(() => CalibrationPodEntry, (entry) => entry.pod, {
    cascade: true,
  })
  entries: CalibrationPodEntry[];

  constructor(body: CalibrationPodInterface) {
    if (!body) {
        return;
    }
    this.entries = [];
    this.name = body.name;
    
  }
}