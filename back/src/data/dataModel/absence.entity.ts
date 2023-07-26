import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserDB } from './user.entity';
import { Raison } from '@app/domain/model/Raison';
import { CRADB } from './cra.entity';

@Entity('absence')
export class AbsenceDB {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  matin: boolean;

  @ManyToOne(() => UserDB)
  collab: UserDB;

  @Column('enum', {
    default: 'Conges',
    enum: ['RTT', 'Conges', 'Maladie', 'Exceptionnel'],
  })
  raison: Raison;

  @ManyToOne(() => CRADB, (cra) => cra.absences)
  cra: CRADB;
}
