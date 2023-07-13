import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { UserDB } from "./user.entity";
import { ActivityDB } from "./activity.entity";
import { Exclude } from "class-transformer";


@Entity('project')
export class ProjectDB {
 
  
  @Column()
  @PrimaryColumn()
  code: string;

  @ManyToMany(() => UserDB,user=>user.projects)
  collabs: UserDB[];

  @OneToMany(() => ActivityDB,(activity) => activity.project)
    activities:ActivityDB[];

 


}