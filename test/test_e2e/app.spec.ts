import { INestApplication } from "@nestjs/common";
import * as request from 'supertest';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { Repository } from "typeorm";
import { CraApplication } from "../../src/domain/application/craApplication";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ModuleRef } from "@nestjs/core";
import { RepoCollab } from "../../src/data/Repository/RepoCollab";
import { Collab } from "../../src/domain/model/Collab";
import { UserDB } from "../../src/data/dataModel/user.entity";
import { AbsenceDB } from "../../src/data/dataModel/absence.entity";
import { ActivityDB } from "../../src/data/dataModel/activity.entity";
import { CRADB } from "../../src/data/dataModel/cra.entity";
import { HolidayDB } from "../../src/data/dataModel/holiday.entity";
import { ProjectDB } from "../../src/data/dataModel/project.entity";
import { Role } from "../../src/domain/model/Role";
import { RepoHoliday } from "../../src/data/Repository/RepoHoliday";
import { RepoCra } from "../../src/data/Repository/RepoCra";

describe('APP', () => {
    let app: INestApplication;
    let moduleRef: TestingModule = null;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({
            imports: [TypeOrmModule.forRoot({
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: 'root',
                password: '',
                database: 'test2',
                entities: [
                    __dirname + '../../src/**/*.entity{.ts,.js}',
                ],
                synchronize: true,
            }), TypeOrmModule.forFeature([UserDB,AbsenceDB,ActivityDB,CRADB,HolidayDB,ProjectDB])],
            providers: [
                CraApplication,{ provide: 'IRepoCollab', useClass: RepoCollab }
                ,{ provide: 'IRepoHoliday', useClass: RepoHoliday },{ provide: 'IRepoCra', useClass: RepoCra },RepoCollab,RepoCra,RepoHoliday,
                ]
        })
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    it(`create user from token`, () => {
        const a: RepoCollab = app.get('IRepoCollab');
        a?.save(new Collab('test','toto',Role.admin));

        //const res = app.get(CraApplication).addUser('token');
        //const repo = moduleRef.get(Repository<CollabDB>);
        // const repo = app.get(Repository<CollabDB>);
        // const createdUser = repo.findOneBy({ email: 'toto' });
        //expect(createdUser).toBeDefined();
    });

    afterAll(async () => {
        await app.close();
    });
});