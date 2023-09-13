import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Raison } from '@app/domain/model/Raison';
import { IsIn, IsInt } from 'class-validator';

@Entity('absence')
export class AbsenceDB {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  date: Date;

  @Column()
  @IsInt()
  @IsIn([50, 100], { message: 'leave percentage must be 50 or 100% only' })
  percentage: number;

  @Column('enum', {
    default: 'Conges',
    enum: [
      'RTT',
      'Conges',
      'Maladie',
      'Exceptionnelle',
      'Formation',
      'Conges sans solde',
    ],
  })
  raison: Raison;

  @PrimaryColumn()
  craId: number;
}
