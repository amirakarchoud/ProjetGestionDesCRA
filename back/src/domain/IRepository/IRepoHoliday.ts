import { Holiday } from '@app/domain/model/Holiday';

export interface IRepoHoliday {
  findAll(): Promise<Holiday[]>;
  save(holiday: Holiday): Promise<void>;
  findByDate(date: Date): Promise<Holiday[]>;
  findForCra(month: number, year: number): Promise<Holiday[]>;
  deleteAll(): Promise<void>;
}
