import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserDB } from "./user.entity";


@Entity('project')
export class ProjectDB {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @ManyToMany(() => UserDB)
  @JoinTable()
  collabs: UserDB[];

 


}