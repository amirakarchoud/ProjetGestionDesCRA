import { Inject, Injectable } from '@nestjs/common';
import { CRA } from '@app/domain/model/CRA';
import { IRepoCra } from '@app/domain/IRepository/IRepoCra';
import { MongoClientWrapper } from '@app/mongo/mongo.client.wrapper';
import { CollabEmail } from '@app/domain/model/collab.email';

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

  public async findByMonthYear(month: number, year: number): Promise<CRA[]> {
    const collection = this.wrapper.getCollection(CRAS_COLLECTION);
    const docs = await collection.find({
      _month: { $eq: month },
      _year: { $eq: year },
    });

    const cras = [];

    for await (const craDoc of docs) {
      cras.push(CRA.fromJson(craDoc));
    }

    return cras;
  }

  async findByMonthYearCollab(
    month: number,
    year: number,
    collabEmail: CollabEmail,
  ): Promise<CRA> {
    const collection = this.wrapper.getCollection(CRAS_COLLECTION);
    const doc = await collection.findOne({
      _month: month,
      _year: year,
      _collab: collabEmail.value,
    });

    if (!doc) {
      return undefined;
    }

    return CRA.fromJson(doc);
  }

  async findByYearUser(collabEmail: CollabEmail, year: number): Promise<CRA[]> {
    const collection = this.wrapper.getCollection(CRAS_COLLECTION);
    const docs = await collection.find({
      _year: year,
      _collab: collabEmail.value,
    });

    const cras = [];

    for await (const craDoc of docs) {
      cras.push(CRA.fromJson(craDoc));
    }

    return cras;
  }

  async save(cra: CRA): Promise<void> {
    const collection = this.wrapper.getCollection(CRAS_COLLECTION);
    const count = await collection.countDocuments({
      _month: cra.month,
      _year: cra.year,
      _collab: cra.collab.value,
    });

    if (count === 0) {
      await collection.insertOne(cra.mapToJson());
    } else {
      await collection.replaceOne({ _id: cra.id }, cra.mapToJson());
    }
  }
}
