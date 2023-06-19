import { Module } from "@nestjs/common";
import { databaseProviders } from "./dataBase.providers";

@Module({
    providers: [...databaseProviders],
    exports: [...databaseProviders],
  })
  export class DatabaseModule {}