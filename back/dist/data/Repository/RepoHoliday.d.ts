import { IRepoHoliday } from "../../domain/IRepository/IRepoHoliday";
import { HolidayDB } from "../dataModel/holiday.entity";
import { Repository } from "typeorm";
import { Holiday } from "../../domain/model/Holiday";
export declare class RepoHoliday implements IRepoHoliday {
    private holidayRepository;
    constructor(holidayRepository: Repository<HolidayDB>);
    fetchAndStoreHolidays(): Promise<HolidayDB[]>;
    findByDate(date: Date): Promise<Holiday[]>;
    findForCra(month: number, year: number): Promise<Holiday[]>;
    checkDateIsHoliday(date: Date): Promise<boolean>;
}
