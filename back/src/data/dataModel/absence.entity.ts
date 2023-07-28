import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Raison } from '@app/domain/model/Raison';

@Entity('absence')
export class AbsenceDB {
  @PrimaryColumn()
  date: Date;

  @PrimaryColumn()
  matin: boolean;

  @Column('enum', {
    default: 'Conges',
    enum: ['RTT', 'Conges', 'Maladie', 'Exceptionnel'],
  })
  raison: Raison;

  @PrimaryColumn()
  craId: number;
}
