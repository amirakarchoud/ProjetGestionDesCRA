import { Holiday } from '@app/domain/model/Holiday';
import { LocalDate, Month } from '@js-joda/core';

export interface IRepoHoliday {
  findAll(): Promise<Holiday[]>;
  save(holiday: Holiday): Promise<void>;
  findByDate(date: LocalDate): Promise<Holiday>;
  deleteAll(): Promise<void>;
  find(month: Month, number: number): Promise<Holiday[]>;
}
