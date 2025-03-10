import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SPMInterface } from "../../interfaces/SPM/spm.interface";
import { SPMEntry } from "./Entry";

@Entity()
export class SPM {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({
    length: 50
  }) name: string;

  @Column({
    length: 50,
    default: ''
  })
  displayName: string;
  
  @Column({
    nullable: true
  }) mac: string;

  @OneToMany(() => SPMEntry, (entry) => entry.spm, {
    cascade: true,
  })
  entries: SPMEntry[];

  constructor(body: SPMInterface) {
    if (!body) {
        return;
    }
    this.name = body.name;
    this.mac = body.mac;
  }
}