import { 
  Column, 
  Entity, 
  ManyToOne, 
  PrimaryGeneratedColumn, 
  JoinColumn 
} from "typeorm";
import { CalibrationBench } from "./Bench";
import { CalibrationPod } from "./Pod";
import { CalibrationPodEntryInterface } from "../../interfaces/calibration-bench/entry";
import { Batch } from "./Batch";  

@Entity()
export class CalibrationPodEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false
  })
  barcode: string;

  @Column({
    nullable: false
  })
  tripTime: number;

  @Column({
    nullable: false
  })
  result: boolean;

  @ManyToOne(() => CalibrationPod, (pod) => pod.entries, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  pod: CalibrationPod;

  
  @ManyToOne(() => Batch, {
    nullable: false,  
    onDelete: 'CASCADE',  
    onUpdate: 'CASCADE',  
  })
  @JoinColumn({ name: 'batch_id' })  
  batch: Batch;

  constructor(body: CalibrationPodEntryInterface) {
    if (!body) {
      return;
    }
    this.barcode = body.barcode;
    this.pod = body.pod;
    this.result = body.result;
    this.tripTime = body.tripTime;
    this.batch = body.batch;  
  }
}
