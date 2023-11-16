import { CRA } from '@app/domain/model/CRA';
import { CollabEmail } from '@app/domain/model/collab.email';
import { Month } from '@js-joda/core';

export interface IRepoCra {
  //findAll(): Promise<CRA[]>;
  save(cra: CRA): Promise<void>;

  findById(id: string): Promise<CRA>;

  findByMonthYearCollab(
    month: Month,
    year: number,
    collab: CollabEmail,
  ): Promise<CRA>;

  findByYearUser(idUser: CollabEmail, year: number): Promise<CRA[]>;

  findByMonthYear(month: Month, year: number): Promise<CRA[]>;
}
