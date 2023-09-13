import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CraApplication } from './domain/application/craApplication';
import { CollabRepository } from './data/Repository/CollabRepository';
import { UserDB } from './data/dataModel/user.entity';
import { AbsenceDB } from './data/dataModel/absence.entity';
import { ActivityDB } from './data/dataModel/activity.entity';
import { CRADB } from './data/dataModel/cra.entity';
import { HolidayDB } from './data/dataModel/holiday.entity';
import { ProjectDB } from './data/dataModel/project.entity';
import { CraService } from './domain/service/cra.service';
import { CraController } from './controllers/cra.controller';
import { CraRepository } from './data/Repository/CraRepository';
import { HolidayRepository } from './data/Repository/HolidayRepository';
import { ScheduleModule } from '@nestjs/schedule';
import { ProjectController } from './controllers/Project.controller';
import { ProjectRepository } from './data/Repository/ProjectRepository';
import { CollabController } from './controllers/Collab.controller';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import { RegulDB } from './data/dataModel/regul.entity';
import { ExportService } from './domain/service/export.service';
import { HolidayController } from './controllers/Holiday.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

let dotEnvPath = '.env';

if (process.env.NODE_ENV) {
  dotEnvPath = `.env_${process.env.NODE_ENV}`;
}

console.log('env is ', dotEnvPath);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: dotEnvPath }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST || 'localhost',
      port: 3306,
      username: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_DATABASE || 'tests',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      dropSchema: true,
      timezone: 'utc',
    }),
    TypeOrmModule.forFeature([
      UserDB,
      AbsenceDB,
      ActivityDB,
      CRADB,
      HolidayDB,
      ProjectDB,
      RegulDB,
    ]),
    ScheduleModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30s' },
    }),
  ],
  controllers: [
    CraController,
    ProjectController,
    CollabController,
    HolidayController,
  ],
  providers: [
    AppService,
    CraApplication,
    CraService,
    ExportService,
    { provide: 'IRepoCollab', useClass: CollabRepository },
    { provide: 'IRepoCra', useClass: CraRepository },
    { provide: 'IRepoHoliday', useClass: HolidayRepository },
    { provide: 'IRepoProject', useClass: ProjectRepository },
  ],
})
export class TestModule {}
