// Batch.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BatchInterface } from "../../interfaces/calibration-bench/batch.interface";
import { CalibrationPodEntry } from "./Entry";

@Entity()
export class Batch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: ["cal", "ver"],
    nullable: false,
  })
  mode: "cal" | "ver";

  @Column({ nullable: false })
  rating: string; // Ensure this matches your intended structure (current1, current2, etc.)

  @Column({ type: "float", nullable: false })
  current: number; // Ensure this matches your intended structure (current1, current2, etc.)

  @Column({ type: "float", nullable: false })
  ambient: number;

  @Column({ type: "float", nullable: false })
  t1: number;

  @Column({ type: "float", nullable: false })
  t2: number;

  @Column({ type: "float", nullable: false })
  t3: number;

  @Column({ type: "float", nullable: false })
  t4: number;

  @Column({ nullable: true })
  timestamp: Date;

  constructor(body: BatchInterface) {
    if (!body) {
      return;
    }
    this.mode = body.mode;
    this.current = body.current;
    this.ambient = body.ambient;
    this.t1 = body.t1;
    this.t2 = body.t2;
    this.t3 = body.t3;
    this.t4 = body.t4;
  }
}
