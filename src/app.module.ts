import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CraApplication } from './domain/application/craApplication';
import { RepoCollab } from './data/Repository/RepoCollab';
import { UserDB } from './data/dataModel/user.entity';
import { TestService } from './controllers/test.service';
import { AbsenceDB } from './data/dataModel/absence.entity';
import { ActivityDB } from './data/dataModel/activity.entity';
import { CRADB } from './data/dataModel/cra.entity';
import { HolidayDB } from './data/dataModel/holiday.entity';
import { ProjectDB } from './data/dataModel/project.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'test2',
    entities: [
      __dirname + '/**/*.entity{.ts,.js}',
  ],
    synchronize: true,
  }), TypeOrmModule.forFeature([UserDB,AbsenceDB,ActivityDB,CRADB,HolidayDB,ProjectDB])],
  controllers: [],
  providers: [AppService,CraApplication,TestService,
    { provide: 'IRepoCollab', useClass: RepoCollab }],
})
export class AppModule {}
