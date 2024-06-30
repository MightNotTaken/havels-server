import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { OTAInterface } from "../interfaces/ota.interface";

@Entity()
export class OTA {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 10,
    nullable: false
  }) version: string;

  @Column({
    length: 20,
    nullable: false
  }) type: string;

  @Column({
    default: 0
  }) target: number;

  @Column({
    default: 0
  }) achieved: number;

  @Column({
    length: 300,
    nullable: false
  }) description: string;

  @Column({
    nullable: false,
    length: 150
  }) path: string;
  
  constructor(body: Partial<OTAInterface>) {
    if (!body) {
      return;
    }
    this.version = body.version;
    this.type = body.type;
    this.description = body.description;
    this.path = body.path;
  }
}