import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserDB } from "./user.entity";
import { Raison } from "../../domain/model/Raison";
import { CRADB } from "./cra.entity";

@Entity('absence')
export class AbsenceDB {
  @PrimaryGeneratedColumn()
  id: number;


  @Column()
  date: Date;

  @Column()
  matin: boolean;

  @ManyToOne(() => UserDB)
  collab: UserDB;

  @Column('enum', { default: 'conges', enum: [ 'rtt', 'conges', 'maladie'] })
  raison: Raison;

  @ManyToOne(() => CRADB, cra => cra.absences)
  cra: CRADB;


}