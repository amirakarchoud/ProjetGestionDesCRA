import { IRepoHoliday } from '@app/domain/IRepository/IRepoHoliday';
import { Inject, Injectable } from '@nestjs/common';
import { Holiday } from '@app/domain/model/Holiday';
import { MongoClientWrapper } from '@app/mongo/mongo.client.wrapper';
import { LocalDate, Month } from '@js-joda/core';
import { IRepoCra } from '@app/domain/IRepository/IRepoCra';

const HOLIDAYS_COLLECTION = 'holidays';

@Injectable()
export class HolidayRepository implements IRepoHoliday {
  constructor(
    @Inject(MongoClientWrapper)
    private client: MongoClientWrapper,
    @Inject('IRepoCra')
    private craRepo: IRepoCra,
  ) {}

  async findAll(): Promise<Holiday[]> {
    const collection = this.client.getCollection(HOLIDAYS_COLLECTION);

    const cursor = collection.find({});

    const holidays = [];

    for await (const doc of cursor) {
      holidays.push(Holiday.fromJson(doc));
    }

    return holidays;
  }

  async findByDate(date: LocalDate): Promise<Holiday> {
    const collection = this.client.getCollection(HOLIDAYS_COLLECTION);

    const document = await collection.findOne({
      _id: date.toString(),
    });

    return Holiday.fromJson(document);
  }

  async deleteAll(): Promise<void> {
    const collection = this.client.getCollection(HOLIDAYS_COLLECTION);

    await collection.deleteMany({});
  }

  async save(holiday: Holiday): Promise<void> {
    const collection = this.client.getCollection(HOLIDAYS_COLLECTION);

    await collection.insertOne({
      _id: holiday.id,
      ...holiday.mapToJson(),
    });
  }

  public async find(month: Month, year: number): Promise<Holiday[]> {
    const collection = this.client.getCollection(HOLIDAYS_COLLECTION);

    const beginningOfMonth = LocalDate.of(year, month, 1);
    const endOfMonth = beginningOfMonth.plusMonths(1);

    const findCursor = collection.find();

    const result: Holiday[] = [];
    for await (const holiday of findCursor) {
      result.push(Holiday.fromJson(holiday));
    }

    return result.filter(
      (holiday) =>
        (holiday.date.isEqual(beginningOfMonth) ||
          holiday.date.isAfter(beginningOfMonth)) &&
        holiday.date.isBefore(endOfMonth),
    );
  }
}
