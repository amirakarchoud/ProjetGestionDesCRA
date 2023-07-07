
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserDB } from "./user.entity";
import { CRADB } from "./cra.entity";
import { ProjectDB } from "./project.entity";

@Entity('activity')
export class ActivityDB {
  @PrimaryGeneratedColumn()
  id: number;


  @Column()
  date: Date;

  @Column()
  matin: boolean;

  @ManyToOne(() => UserDB)
  collab: UserDB;

  @ManyToOne(() => ProjectDB)
  project: ProjectDB;

  @ManyToOne(() => CRADB)
  cra: CRADB;



}