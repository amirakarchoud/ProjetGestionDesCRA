import { HolidayDB } from '../../data/dataModel/holiday.entity';
import { Holiday } from '../model/Holiday';

export interface IRepoHoliday {
  findAll(): Promise<Holiday[]>;
  //save(holiday: Holiday): Promise<Holiday>;
  findByDate(date: Date): Promise<Holiday[]>;
  fetchAndStoreHolidays(): Promise<HolidayDB[]>;
  checkDateIsHoliday(date: Date): Promise<boolean>;
  findForCra(month: number, year: number): Promise<Holiday[]>;
}
