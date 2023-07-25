import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from "typeorm";
import { CraApplication } from '../src/domain/application/craApplication';
import { RepoCollab } from "../src/data/Repository/RepoCollab";
import { AppModule } from "../src/app.module";
import { Project } from "../src/domain/model/Project";
import { RepoProject } from "../src/data/Repository/RepoProject";
import { RepoCra } from "../src/data/Repository/RepoCra";
import { Raison } from "../src/domain/model/Raison";
import { CreateAbsenceDto } from "../src/Dto/CreateAbsenceDto";
import { CreateActivityDto } from "../src/Dto/CreateActivityDto";

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
    beforeEach(async () => {
        const ds = app.get(DataSource);
        //ds.manager.query('truncate user ')
        // let a = 43
    })

    it(`create user from token`, async () => {
        const repo: RepoCollab = app.get('IRepoCollab');
        const application = app.get(CraApplication);

        const res = await application.addUser('token');
        const createdUser = await repo.findById('test1');
        expect(createdUser).toBeDefined();
    });

    it(`create project`, async () => {

        const repo: RepoProject = app.get('IRepoProject');
        const repoCollab: RepoCollab = app.get('IRepoCollab');
        const application = app.get(CraApplication);

        const res = await application.addUser('token');
        const createdUser = await repoCollab.findById('test1');
        const project = new Project("code", [createdUser.email]);
        const createdProject = await repo.save(project);
        expect(project).toBeDefined();

    });

    it(`delete project`, async () => {

        const repo: RepoProject = app.get('IRepoProject');
        const application = app.get(CraApplication);
        const project = new Project("projetTest", []);
        const createdProject = await repo.save(project);
        expect(project).toBeDefined();
        await application.deleteProject("projetTest");
        await expect(repo.findById("projetTest")).rejects.toThrowError('Project not found');


    });

    it(`create absence`, async () => {
        const date = new Date();
        const repoCollab: RepoCollab = app.get('IRepoCollab');
        const repo: RepoCra = app.get('IRepoCra');
        const application = app.get(CraApplication);
        const absence = new CreateAbsenceDto();
        absence.date = date;
        absence.matin = false;
        absence.raison = Raison.RTT;
        absence.craId = 1;

        absence.collabId = 'test1';
        let cra = await repo.findByMonthYearCollab(date.getMonth() + 1, date.getFullYear(), 'test1');
        await application.deleteAbsence(cra.id, date, absence.matin);
        const res = await application.addAbsence(absence);
        cra = await repo.findByMonthYearCollab(date.getMonth() + 1, date.getFullYear(), 'test1');
        expect(cra.absences).toHaveLength(1);
    });





    it(`create activity`, async () => {
        const date = new Date();
        const repoCollab: RepoCollab = app.get('IRepoCollab');
        const repo: RepoCra = app.get('IRepoCra');
        const application = app.get(CraApplication);
        const activity = new CreateActivityDto();
        activity.date = date;
        activity.matin = false;
        activity.projectId = "code";
        activity.craId = 1;
        //const res1 = await application.addUser('token');
        let cra = await repo.findByMonthYearCollab(date.getMonth() + 1, date.getFullYear(), 'test1');
        await application.deleteActivity(cra.id, date, activity.matin);
        activity.collabId = 'test1';
        const res = await application.addActivity(activity);
        cra = await repo.findByMonthYearCollab(date.getMonth() + 1, date.getFullYear(), 'test1');
        expect(cra.activities).toHaveLength(1);
    });


    afterAll(async () => {
        await app.close();
    });
});