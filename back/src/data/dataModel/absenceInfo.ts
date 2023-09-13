import { Column } from 'typeorm';
import { Raison } from '@app/domain/model/Raison';
import { IsIn, IsInt } from 'class-validator';

export class AbsenceInfo {
  @Column()
  date: Date;

  @Column()
  @IsIn([50, 100])
  @IsInt()
  percentage: number;

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
