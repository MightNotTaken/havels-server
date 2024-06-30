import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SPM } from "./SPM";
import { SPMEntryInterface } from "../../interfaces/SPM/entry.interface";

@Entity()
export class SPMEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 10,
    nullable: false
  })
  shift: string;

  @Column({
    length: 70,
    nullable: false
  })
  data: string;

  @Column()
  date: Date;

  @ManyToOne(() => SPM, (spm) => spm.entries, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  spm: SPM;

  constructor(body: SPMEntryInterface) {
    if (!body) {
      return;
    }
    this.shift = body.shift;
    this.data = body.data;
    this.date = body.date;
    this.spm = body.spm;
  }
}