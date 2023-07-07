import { Holiday } from "../model/Holiday";

export interface IRepoHoliday {
    //findAll(): Promise<Holiday[]>;
    //save(holiday: Holiday): Promise<Holiday>;
    findByDate(date:Date): Promise<Holiday>;
  }