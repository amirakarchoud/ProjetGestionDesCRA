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

  async findAll(): Promise<Holiday[]> {
    const collection = this.client.getCollection(HOLIDAYS_COLLECTION);

    const cursor = collection.find({});

    const holidays = [];

    for await (const doc of cursor) {
      holidays.push(Holiday.fromJson(doc));
    }

    return holidays;
  }

  async findByDate(date: Date): Promise<Holiday> {
    const collection = this.client.getCollection(HOLIDAYS_COLLECTION);

    const document = await collection.findOne({
      _id: date.toLocaleDateString('fr-FR'),
    });

    return Holiday.fromJson(document);
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
}
