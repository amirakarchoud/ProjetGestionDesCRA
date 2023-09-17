import { Inject, Injectable } from '@nestjs/common';
import { CRA } from '@app/domain/model/CRA';
import { IRepoCra } from '@app/domain/IRepository/IRepoCra';
import { MongoClientWrapper } from '@app/mongo/mongo.client.wrapper';

const CRAS_COLLECTION = 'CRAs';

@Injectable()
export class CraRepository implements IRepoCra {
  constructor(
    @Inject(MongoClientWrapper)
    private wrapper: MongoClientWrapper,
  ) {}

  async findById(id: string): Promise<CRA> {
    const collection = this.wrapper.getCollection(CRAS_COLLECTION);
    const doc = await collection.findOne({
      _id: id,
    });

    return CRA.fromJson(doc);
  }

  findByMonthYear(month: number, year: number): Promise<CRA[]> {
    return Promise.resolve([]);
  }

  async findByMonthYearCollab(
    month: number,
    year: number,
    collab: string,
  ): Promise<CRA> {
    const collection = this.wrapper.getCollection(CRAS_COLLECTION);
    const doc = await collection.findOne({
      _month: month,
      _year: year,
      '_collab._email': collab,
    });

    if (!doc) {
      return undefined;
    }

    return CRA.fromJson(doc);
  }

  findByYearUser(idUser: string, year: number): Promise<CRA[]> {
    return Promise.resolve([]);
  }

  async save(cra: CRA): Promise<void> {
    const collection = this.wrapper.getCollection(CRAS_COLLECTION);
    const count = await collection.countDocuments({
      _month: cra.month,
      _year: cra.year,
      '_collab._email': cra.collab.email,
    });

    if (count === 0) {
      await collection.insertOne(cra.mapToJson());
    } else {
      await collection.replaceOne({ _id: cra.id }, cra.mapToJson());
    }
  }
}
