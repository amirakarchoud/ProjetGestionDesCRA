import { Column, Entity, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm';
import { UserDB } from './user.entity';
import { ActivityDB } from './activity.entity';
import { ProjetStatus } from '@app/domain/model/projetStatus.enum';

@Entity('project')
export class ProjectDB {
  @Column()
  @PrimaryColumn()
  code: string;

  @Column()
  name: string;

  @Column()
  client: string;

  @Column()
  date: Date;

  @Column('enum', {
    default: 'Active',
    enum: ['Active', 'Desactive'],
  })
  status: ProjetStatus;

  @ManyToMany(() => UserDB, (user) => user.projects)
  collabs: UserDB[];

  @OneToMany(() => ActivityDB, (activity) => activity.project)
  activities: ActivityDB[];
}
