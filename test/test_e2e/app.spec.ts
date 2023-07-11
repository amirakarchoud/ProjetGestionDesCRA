import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from "typeorm";
import { CraApplication } from "../../src/domain/application/craApplication";
import { RepoCollab } from "../../src/data/Repository/RepoCollab";
import { AppModule } from "../../src/app.module";
import { Project } from "../../src/domain/model/Project";
import { RepoProject } from "../../src/data/Repository/RepoProject";

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
        //ds.manager.query('truncate user ')
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

    it(`create project`, async () => {
        
        const repo: RepoProject = app.get('IRepoProject');
        const repoCollab: RepoCollab = app.get('IRepoCollab');
        const application = app.get(CraApplication);

        const res = await application.addUser('token');
        const createdUser = await repoCollab.findById('test1');
        const project=new Project("code",[createdUser.email]);
        const createdProject=await repo.save(project);
        expect(project).toBeDefined();
        
    });


    afterAll(async () => {
        await app.close();
    });
});