import { CRA } from '@app/domain/model/CRA';

export interface IRepoCra {
  //findAll(): Promise<CRA[]>;
  save(cra: CRA): Promise<void>;
  findById(id: string): Promise<CRA>;
  findByMonthYearCollab(
    month: number,
    year: number,
    collab: string,
  ): Promise<CRA>;
  findByYearUser(idUser: string, year: number): Promise<CRA[]>;
  findByMonthYear(month: number, year: number): Promise<CRA[]>;
}
