import { Column } from 'typeorm';
import { Raison } from '@app/domain/model/Raison';
export class AbsenceInfo {
  @Column()
  date: Date;

  @Column()
  matin: boolean;

  @Column('enum', {
    enum: [
      'RTT',
      'Conges',
      'Maladie',
      'Exceptionnelle',
      'Formation',
      'Conges sans solde',
    ],
    nullable: true,
  })
  raison!: Raison;

  @Column({ nullable: true })
  code!: string;
}
