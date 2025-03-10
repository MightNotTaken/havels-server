// Bench.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CalibrationPod } from "./Pod";
import { CalibrationBenchInterface } from "../../interfaces/calibration-bench/bench.interface";
import { Batch } from "./Batch";

@Entity()
export class CalibrationBench {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({
    length: 50,
    nullable: false
  })
  name: string;

  @Column({
    length: 50,
    default: ''
  })
  displayName: string;
  
  @Column({
    length: 30,
    nullable: true
  })
  mac: string;
  

  @OneToMany(() => CalibrationPod, (pod) => pod.bench, {
    cascade: true,
  })
  pods: CalibrationPod[];
  

  @OneToMany(() => Batch, (batch) => batch.bench, {
    cascade: true,
  })
  batches: Batch[];

  constructor(body: Partial<CalibrationBenchInterface>) {
    if (!body) {
      return;
    }
    this.name = body.name;
    this.mac = body.mac;
  }
}
