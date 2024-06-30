import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CalibrationPod } from "./Pod";
import { CalibrationBenchInterface } from "../../interfaces/calibration-bench/bench.interface";

@Entity()
export class CalibrationBench {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({
    length: 30,
    nullable: false
  }) name: string;

  @OneToMany(() => CalibrationPod, (pod) => pod.bench, {
    cascade: true,
  }) pods: CalibrationPod[];

  constructor(body: CalibrationBenchInterface) {
    if (!body) {
        return;
    }
    this.name = body.name;    
  }
}