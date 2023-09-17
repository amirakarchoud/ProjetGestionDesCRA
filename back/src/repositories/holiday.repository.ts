import { IRepoHoliday } from '@app/domain/IRepository/IRepoHoliday';
import { Inject, Injectable } from '@nestjs/common';
import { Holiday } from '@app/domain/model/Holiday';
import { MongoClientWrapper } from '@app/mongo/mongo.client.wrapper';

@Injectable()
export class HolidayRepository implements IRepoHoliday {
  constructor(
    @Inject(MongoClientWrapper)
    private client: MongoClientWrapper,
  ) {}

  checkDateIsHoliday(date: Date): Promise<boolean> {
    return Promise.resolve(false);
  }

  fetchAndStoreHolidays() {
    console.log('R');
  }

  findAll(): Promise<Holiday[]> {
    return Promise.resolve([]);
  }

  findByDate(date: Date): Promise<Holiday[]> {
    return Promise.resolve([]);
  }

  findForCra(month: number, year: number): Promise<Holiday[]> {
    return Promise.resolve([]);
  }

  // async findAll(): Promise<Holiday[]> {
  //   const holidaysDB = await this.holidayRepository.find();
  //
  //   return holidaysDB.map((holidayDB) => {
  //     return new Holiday(holidayDB.id, holidayDB.date, holidayDB.name);
  //   });
  // }
  //
  // @Cron('0 0 1 1 *')
  // async fetchAndStoreHolidays(): Promise<HolidayDB[]> {
  //   console.log('fetching holidays');
  //   await this.holidayRepository.delete({});
  //   const year = new Date().getFullYear();
  //   const url = `${environment.apiUrl}${year}.json`;
  //   console.log(url);
  //
  //   try {
  //     const data = await new Promise<string>((resolve, reject) => {
  //       https
  //         .get(url, (res) => {
  //           let data = '';
  //
  //           res.on('data', (chunk) => {
  //             data += chunk;
  //           });
  //
  //           res.on('end', () => {
  //             resolve(data);
  //           });
  //         })
  //         .on('error', (error) => {
  //           reject(error);
  //         });
  //     });
  //
  //     const holidaysData = JSON.parse(data);
  //     const holidays: HolidayDB[] = [];
  //     for (const [dateStr, name] of Object.entries(holidaysData)) {
  //       const date = new Date(dateStr);
  //
  //       const existingHoliday = await this.holidayRepository.findOne({
  //         where: { date },
  //       });
  //       if (!existingHoliday) {
  //         const holiday = new HolidayDB();
  //         holiday.date = date;
  //         holiday.name = name as string;
  //         holidays.push(holiday);
  //       }
  //     }
  //     const savedHolidays = await this.holidayRepository.save(holidays);
  //     console.log('done fetching holidays');
  //     return savedHolidays;
  //   } catch (error) {
  //     console.error('Error fetching holidays:', error);
  //     throw error;
  //   }
  // }
  //
  // async checkTableEmpty(): Promise<boolean> {
  //   const count = await this.holidayRepository.count();
  //   return count === 0;
  // }
  //
  // async findByDate(date: Date): Promise<Holiday[]> {
  //   console.log('date in find holiday ' + date);
  //   const holiday = await this.holidayRepository.find({ where: { date } });
  //   const returnedHoliday: Holiday[] = [];
  //   console.log('find done');
  //   if (holiday) {
  //     holiday.forEach((element) => {
  //       returnedHoliday.push(
  //         new Holiday(element.id, element.date, element.name),
  //       );
  //     });
  //     return returnedHoliday;
  //   }
  //   return null;
  // }
  //
  // async findForCra(month: number, year: number): Promise<Holiday[]> {
  //   const startDate = new Date(year, month - 1, 1);
  //   const endDate = new Date(year, month, 0);
  //
  //   const holidays = await this.holidayRepository.find({
  //     where: {
  //       date: Between(startDate, endDate),
  //     },
  //   });
  //
  //   if (holidays) {
  //     const returnedHoliday: Holiday[] = holidays.map(
  //       (holiday) => new Holiday(holiday.id, holiday.date, holiday.name),
  //     );
  //     return returnedHoliday;
  //   }
  //
  //   return [];
  // }
  //
  // async checkDateIsHoliday(date: Date): Promise<boolean> {
  //   const startDate = new Date(
  //     date.getFullYear(),
  //     date.getMonth(),
  //     date.getDate(),
  //   );
  //   const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
  //   const holiday = await this.holidayRepository.findOne({
  //     where: {
  //       date: Between(startDate, endDate),
  //     },
  //   });
  //   return !!holiday;
  // }
}
