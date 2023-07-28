import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CRADB } from './cra.entity';
import { Action } from '../../domain/model/action.enum';

@Entity('regul')
export class RegulDB {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;
  @Column('enum', { default: 'Add', enum: ['Add', 'Delete'] })
  action: Action;

  @ManyToOne(() => CRADB)
  cra: CRADB;
}
