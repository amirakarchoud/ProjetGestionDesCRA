import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { MongoConfig } from './mongo.module';
import { Db, MongoClient } from 'mongodb';
import { CONFIG_OPTIONS } from '@app/constants';

console.log('CONSOLE', CONFIG_OPTIONS);

@Injectable()
export class MongoClientWrapper implements OnApplicationShutdown, OnModuleInit {
  private _client: MongoClient;
  private _db: Db;

  constructor(@Inject(CONFIG_OPTIONS) private readonly config: MongoConfig) {}

  get client(): MongoClient {
    return this._client;
  }

  get db(): Db {
    return this._db;
  }

  async onApplicationShutdown(): Promise<void> {
    await this._client.close();
  }

  public getCollection(name: string) {
    return this.db.collection<{ _id: string }>(name);
  }

  async onModuleInit(): Promise<void> {
    this._client = new MongoClient(this.config.uri, this.config.options);
    await this._client.connect();

    const dbName = process.env.MONGO_DB || this.config.database || 'cra';

    console.log('Connecting to database', dbName);

    this._db = this.client.db(dbName);
  }
}
