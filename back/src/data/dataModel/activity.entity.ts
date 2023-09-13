import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectDB } from './project.entity';
import { IsDate, IsIn, IsInt, Max, Min } from 'class-validator';

@Entity('activity')
export class ActivityDB {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsDate()
  date: Date;

  @Column()
  @IsInt()
  @IsIn([25, 50, 75, 100], {
    message: 'percentage must be within 25,50,75 or 100%',
  })
  percentage: number;

  @ManyToOne(() => ProjectDB, { cascade: false })
  project: ProjectDB;

  @PrimaryColumn()
  craId: number;
}
