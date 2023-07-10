import { IRepoHoliday } from "../../domain/IRepository/IRepoHoliday";
import { HolidayDB } from "../dataModel/holiday.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Between, Repository } from "typeorm";
import * as https from 'https';
import { Holiday } from "../../domain/model/Holiday";
import { environment } from "../../environment/environment";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class RepoHoliday implements IRepoHoliday {
  constructor(
    @InjectRepository(HolidayDB)
    private holidayRepository: Repository<HolidayDB>
  ) {}


  //@Cron('0 * * * * *')
  async fetchAndStoreHolidays(): Promise<HolidayDB[]> {
    console.log("fetching holidays");
    await this.holidayRepository.clear();
    const year = new Date().getFullYear();
    const url = `${environment.apiUrl}${year}.json`;
    console.log(url);

    try {
      const data = await new Promise<string>((resolve, reject) => {
        https.get(url, (res) => {
          let data = '';

          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            resolve(data);
          });
        }).on('error', (error) => {
          reject(error);
        });
      });

      const holidaysData = JSON.parse(data);
      const holidays: HolidayDB[] = [];
      let i=0;
      for (const [dateStr, name] of Object.entries(holidaysData)) {
        const date = new Date(dateStr);
        const namehol=name as string;
         
        const existingHoliday = await this.holidayRepository.findOne({ where: { date } });
        //console.log("existing= "+existingHoliday.date);
        if (!existingHoliday) {
          i++;

          const holiday = new HolidayDB();
          holiday.date = date;
          holiday.name = name as string;
          console.log("holiday= " + holiday.name);
          holidays.push(holiday);
        }
      }
      console.log("i= "+i);
      const savedHolidays = await this.holidayRepository.save(holidays);
      console.log("done fetching holidays");
      return savedHolidays;
    } catch (error) {
      console.error("Error fetching holidays:", error);
      throw error;
    }
  }



    async findByDate(date: Date): Promise<Holiday[]> {
      console.log("date in find holiday "+date);
       const holiday= await this.holidayRepository.find({where:{date}});
       let returnedHoliday: Holiday[]=[];
       console.log("find done");
       if(holiday)
       {
        holiday.forEach(element => {
          returnedHoliday.push(new Holiday(element.date,element.name))
          
        });
       return returnedHoliday;
       }
       return null;
    }

    async findForCra(month: number, year: number): Promise<Holiday[]> {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
    
      const holidays = await this.holidayRepository.find({
        where: {
          date: Between(startDate, endDate),
        },
      });
    
      if (holidays) {
        const returnedHoliday: Holiday[] = holidays.map((holiday) => new Holiday(holiday.date, holiday.name));
        return returnedHoliday;
      }
    
      return [];
    }
    


    async checkDateIsHoliday(date: Date): Promise<boolean> {
      const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000); 
      const holiday = await this.holidayRepository.findOne({where: {
        date: Between(startDate, endDate),
      }, });
      return !!holiday;
    }
   

}