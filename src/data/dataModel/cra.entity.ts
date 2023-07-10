import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserDB } from "./user.entity";
import { Etat } from "../../domain/model/etat.enum";
import { AbsenceDB } from "./absence.entity";
import { ActivityDB } from "./activity.entity";


@Entity('cra')
export class CRADB {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;
  @Column()
  month: number;
  @Column()
  year: number;
  @Column()
  etat:Etat;


  @ManyToOne(() => UserDB)
  collab: UserDB;

  @OneToMany(() => AbsenceDB,(absence)=>absence.cra,{ cascade: true })
  absences: AbsenceDB[];

  @OneToMany(() => ActivityDB,(activity)=>activity.cra,{ cascade: true })
  activities: ActivityDB[];




}