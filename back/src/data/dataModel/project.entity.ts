// eslint-disable-next-line prettier/prettier
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { UserDB } from './user.entity';
import { ActivityDB } from './activity.entity';

@Entity('project')
export class ProjectDB {
  @Column()
  @PrimaryColumn()
  code: string;

  @ManyToMany(() => UserDB, (user) => user.projects)
  collabs: UserDB[];

  @OneToMany(() => ActivityDB, (activity) => activity.project)
  activities: ActivityDB[];
}
