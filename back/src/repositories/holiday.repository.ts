import { IRepoHoliday } from '@app/domain/IRepository/IRepoHoliday';
import { Inject, Injectable } from '@nestjs/common';
import { Holiday } from '@app/domain/model/Holiday';
import { MongoClientWrapper } from '@app/mongo/mongo.client.wrapper';

const HOLIDAYS_COLLECTION = 'holidays';

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

  async findAll(): Promise<Holiday[]> {
    const collection = this.client.getCollection(HOLIDAYS_COLLECTION);

    const cursor = collection.find({});

    const holidays = [];

    for await (const doc of cursor) {
      holidays.push(Holiday.fromJson(doc));
    }

    return holidays;
  }

  findByDate(date: Date): Promise<Holiday[]> {
    return Promise.resolve([]);
  }

  findForCra(month: number, year: number): Promise<Holiday[]> {
    return Promise.resolve([]);
  }

  async deleteAll(): Promise<void> {
    const collection = this.client.getCollection(HOLIDAYS_COLLECTION);

    await collection.deleteMany({});
  }

  async save(holiday: Holiday): Promise<void> {
    const collection = this.client.getCollection(HOLIDAYS_COLLECTION);

    await collection.insertOne({
      _id: holiday.id,
      ...holiday,
    });
  }

  // async findAll(): Promise<Holiday[]> {
  //   const holidaysDB = await this.holidayRepository.find();
  //
  //   return holidaysDB.map((holidayDB) => {
  //     return new Holiday(holidayDB.id, holidayDB.date, holidayDB.name);
  //   });
  // }
  //
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
