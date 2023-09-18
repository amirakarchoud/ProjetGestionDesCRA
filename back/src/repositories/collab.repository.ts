import { Inject, Injectable } from '@nestjs/common';
import { IRepoCollab } from '@app/domain/IRepository/IRepoCollab';
import { MongoClientWrapper } from '@app/mongo/mongo.client.wrapper';
import { Collab } from '@app/domain/model/Collab';

const USER_COLLECTION = 'users';

@Injectable()
export class CollabRepository implements IRepoCollab {
  constructor(
    @Inject(MongoClientWrapper)
    private wrapper: MongoClientWrapper,
  ) {}

  findAll(): Promise<Collab[]> {
    return Promise.resolve([]);
  }

  async findById(id: string): Promise<Collab> {
    const usersCollection = this.wrapper.db.collection<{ _id: string }>(
      'users',
    );
    const foundUser = await usersCollection.findOne({
      _id: id,
    });

    if (!foundUser) {
      throw new Error(`User "${id}" not found`);
    }

    return Collab.fromJson(foundUser);
  }

  findByIds(ids: string[]): Promise<Collab[]> {
    return Promise.resolve([]);
  }

  async save(user: Collab): Promise<void> {
    const doc = {
      _id: user.email,
      ...user,
    };

    await this.wrapper.getCollection(USER_COLLECTION).insertOne(doc);
  }
}
