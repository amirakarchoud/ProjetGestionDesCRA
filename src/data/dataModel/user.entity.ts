import { generatePrime } from "crypto";
import { Role } from "../../domain/model/Role";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { AbsenceDB } from "./absence.entity";
import { CRADB } from "./cra.entity";
import { ActivityDB } from "./activity.entity";
import { ProjectDB } from "./project.entity";
import { Exclude } from "class-transformer";

@Entity('user')
export class UserDB{
  
    @Column()
    @PrimaryColumn()
    email:string;
  
    @Column()
    name: string;
  
    @Column('enum', { default: 'collab', enum: [ 'admin', 'collab'] })
    role: Role;
  
    @OneToMany(() => AbsenceDB,(absence) => absence.collab)
    absences:AbsenceDB[];
  
    @OneToMany(() => ActivityDB,(activity) => activity.collab)
    activities:ActivityDB[];
  
  
    @ManyToMany(() => ProjectDB,(project) => project.collabs,{ cascade: true })
    @JoinTable()
    projects:ProjectDB[];
  
    @OneToMany(() => CRADB,(cra) => cra.collab)
    cras:CRADB[];
  
  
  
}