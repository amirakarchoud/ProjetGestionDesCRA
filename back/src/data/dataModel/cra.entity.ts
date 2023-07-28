import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserDB } from './user.entity';
import { Etat } from '@app/domain/model/etat.enum';
import { HolidayDB } from './holiday.entity';
import { RegulDB } from './regul.entity';
import { Status } from '@app/domain/model/Status';

@Entity('cra')
export class CRADB {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;
  @Column()
  month: number;
  @Column()
  year: number;
  @Column()
  etat: Etat;
  @Column('enum', { default: 'Open', enum: ['Open', 'Closed'] })
  status: Status;

  @ManyToOne(() => UserDB)
  collab: UserDB;

  @OneToMany(() => RegulDB, (regul) => regul.cra, { cascade: true })
  history: RegulDB[];

  @ManyToMany(() => HolidayDB, (holiday) => holiday.cras)
  @JoinTable()
  holidays: HolidayDB[];
}
