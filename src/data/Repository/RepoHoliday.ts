import { IRepoHoliday } from "../../domain/IRepository/IRepoHoliday";
import { HolidayDB } from "../dataModel/holiday.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Holiday } from "../../domain/model/Holiday";

@Injectable()
export class RepoHoliday implements IRepoHoliday {
  constructor(
    @InjectRepository(HolidayDB)
    private holidayRepository: Repository<HolidayDB>
  ) {}


    async findByDate(date: Date): Promise<Holiday> {
       const holiday= await this.holidayRepository.findOne({where:{date}});
       return new Holiday(holiday.date,holiday.name)
    }
   

}