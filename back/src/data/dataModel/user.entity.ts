import { Role } from '../../domain/model/Role';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { CRADB } from './cra.entity';
import { ProjectDB } from './project.entity';

@Entity('user')
export class UserDB {
  @Column()
  @PrimaryColumn()
  email: string;

  @Column()
  name: string;
  @Column()
  lastname: string;

  @Column()
  password: string;

  @Column('enum', { default: 'collab', enum: ['admin', 'collab'] })
  role: Role;

  @ManyToMany(() => ProjectDB, (project) => project.collabs)
  @JoinTable()
  projects: ProjectDB[];

  @OneToMany(() => CRADB, (cra) => cra.collab)
  cras: CRADB[];
}
