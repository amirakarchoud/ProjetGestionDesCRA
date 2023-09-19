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

  async findAll(): Promise<Collab[]> {
    const usersCollection = this.wrapper.db.collection<{ _id: string }>(
      'users',
    );

    const allUsers = [];
    for await (const userDoc of usersCollection.find()) {
      allUsers.push(Collab.fromJson(userDoc));
    }

    return allUsers;
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

  async findByIds(ids: string[]): Promise<Collab[]> {
    const usersCollection = this.wrapper.db.collection<{ _id: string }>(
      'users',
    );

    const allUsers = [];
    const findCursor = usersCollection.find({
      _id: { $in: ids },
    });

    for await (const userDoc of findCursor) {
      allUsers.push(Collab.fromJson(userDoc));
    }

    return allUsers;
  }

  async save(user: Collab): Promise<void> {
    const doc = {
      _id: user.email,
      ...user,
    };

    await this.wrapper.getCollection(USER_COLLECTION).insertOne(doc);
  }
}
