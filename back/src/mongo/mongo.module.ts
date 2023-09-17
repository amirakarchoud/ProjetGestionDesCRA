import { ConnectionOptions } from 'mongodb';
import { DynamicModule, Module } from '@nestjs/common';
import { MongoClientWrapper } from './mongo.client.wrapper';
import { CONFIG_OPTIONS } from '@app/constants';

export type MongoConfig = {
  uri: string;
  database?: string;
  options?: ConnectionOptions;
};

@Module({})
export class MongoModule {
  static register(config: MongoConfig): DynamicModule {
    return {
      module: MongoModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: config,
        },
        MongoClientWrapper,
      ],
      exports: [MongoClientWrapper],
    };
  }
}
