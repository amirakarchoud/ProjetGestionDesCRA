import { Module } from '@nestjs/common';
import { CraController } from './controllers/cra.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { ProjectController } from './controllers/project.controller';
import { HolidayController } from './controllers/Holiday.controller';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import { ExportService } from './domain/service/export.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './domain/service/auth.service';
import { MongoModule } from '@app/mongo/mongo.module';
import { CollabRepository } from '@app/repositories/collab.repository';
import { CraRepository } from '@app/repositories/cra.repository';
import { HolidayRepository } from '@app/repositories/holiday.repository';
import { ProjectRepository } from '@app/repositories/project.repository';
import { CollabController } from '@app/controllers/collab.controller';
import { HolidaysSyncService } from '@app/services/holidays-sync.service';
import { HttpHolidayFetchService } from '@app/services/http-holiday-fetch.service';
import { ExportController } from '@app/controllers/export.controller';
import { CraApplication } from '@app/domain/application/cra.application';
import { ActivityReportController } from '@app/controllers/v2/activity-report.controller';
import { EmployeeController } from '@app/controllers/v2/employee.controller';
import { ProjectV2Controller } from '@app/controllers/v2/project-v2.controller';

let dotEnvPath = '.env';

if (process.env.NODE_ENV) {
  dotEnvPath = `.env_${process.env.NODE_ENV}`;
}

console.log('env is ', dotEnvPath);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: dotEnvPath }),
    MongoModule.register({ uri: process.env.MONGO_URI }),
    ScheduleModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '600s' },
    }),
  ],
  controllers: [
    CraController,
    ProjectController,
    CollabController,
    HolidayController,
    AuthController,
    ExportController,
    ActivityReportController,
    EmployeeController,
    ProjectV2Controller,
  ],
  providers: [
    CraApplication,
    AuthService,
    ExportService,
    HolidaysSyncService,
    HttpHolidayFetchService,
    { provide: 'IRepoCollab', useClass: CollabRepository },
    { provide: 'IRepoCra', useClass: CraRepository },
    { provide: 'IRepoHoliday', useClass: HolidayRepository },
    { provide: 'IRepoProject', useClass: ProjectRepository },
  ],
})
export class AppModule {}
