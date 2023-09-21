import { CRA } from '@app/domain/model/CRA';
import { CollabEmail } from '@app/domain/model/collab.email';

export interface IRepoCra {
  //findAll(): Promise<CRA[]>;
  save(cra: CRA): Promise<void>;
  findById(id: string): Promise<CRA>;
  findByMonthYearCollab(
    month: number,
    year: number,
    collab: CollabEmail,
  ): Promise<CRA>;
  findByYearUser(idUser: CollabEmail, year: number): Promise<CRA[]>;
  findByMonthYear(month: number, year: number): Promise<CRA[]>;
}
