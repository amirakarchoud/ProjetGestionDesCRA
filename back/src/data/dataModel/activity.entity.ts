import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { ProjectDB } from './project.entity';

@Entity('activity')
export class ActivityDB {
  @PrimaryColumn()
  date: Date;

  @PrimaryColumn()
  matin: boolean;

  @ManyToOne(() => ProjectDB, { cascade: false })
  project: ProjectDB;

  @PrimaryColumn()
  craId: number;
}
