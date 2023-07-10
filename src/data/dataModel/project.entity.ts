import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserDB } from "./user.entity";
import { ActivityDB } from "./activity.entity";


@Entity('project')
export class ProjectDB {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @ManyToMany(() => UserDB)
  @JoinTable()
  collabs: UserDB[];

  @OneToMany(() => ActivityDB,(activity) => activity.project)
    activities:ActivityDB[];

 


}