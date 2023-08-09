import { Holiday } from '../model/Holiday';

export interface IRepoHoliday {
  findAll(): Promise<Holiday[]>;
  findByDate(date: Date): Promise<Holiday[]>;
  fetchAndStoreHolidays();
  checkDateIsHoliday(date: Date): Promise<boolean>;
  findForCra(month: number, year: number): Promise<Holiday[]>;
}
