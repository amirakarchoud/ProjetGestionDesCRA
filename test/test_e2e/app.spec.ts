import { INestApplication } from "@nestjs/common";
import * as request from 'supertest';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { DataSource, Repository, getManager } from "typeorm";
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
import { AppModule } from "../../src/app.module";

describe('APP', () => {
    let app: INestApplication;
    let moduleRef: TestingModule = null;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        })
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });
    beforeEach(async ()=> {
        const ds = app.get(DataSource);
        ds.manager.query('truncate user ')
       // let a = 43
    })

    it(`create user from token`, async () => {
        const repo: RepoCollab = app.get('IRepoCollab');
        const application = app.get(CraApplication);
        //await a?.save(new Collab('test', 'toto', Role.admin));

        const res = await application.addUser('token');
        //const repo = moduleRef.get(Repository<CollabDB>);
        //const repo = app.get(Repository<Collab>);
        const createdUser = await repo.findById('test1');
        expect(createdUser).toBeDefined();
    });

    afterAll(async () => {
        await app.close();
    });
});