import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CRADB } from "./cra.entity";

@Entity('holiday')
export class HolidayDB {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  name: string;

  @ManyToMany(() => CRADB, cra => cra.holidays)
  cras: CRADB;
  
}