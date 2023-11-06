import { createProject, createUser } from './test.utils';
import { ProjetStatus } from '@app/domain/model/projetStatus.enum';
import { ProjectRepository } from '@app/repositories/project.repository';
import { Project } from '@app/domain/model/Project';
import { ProjectCode } from '@app/domain/model/project.code';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@app/app.module';
import { MongoClientWrapper } from '@app/mongo/mongo.client.wrapper';
import { CollabEmail } from '@app/domain/model/collab.email';
import { ProjectDto } from '@app/dtos/project.dto';
import * as request from 'supertest';

describe('Project controller', () => {
  let app: INestApplication;
  let moduleRef: TestingModule = null;
  const clientId = new CollabEmail('test1@proxym.fr');

  afterAll(async () => {
    if (app) {
      try {
        await moduleRef.close();
        await app.close();
      } catch (e) {
        console.error('Problem closing app', e);
      }
    }
  });

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    const wrapper: MongoClientWrapper = app.get(MongoClientWrapper);
    await wrapper.db.dropDatabase();
  });

  it(`create project`, async () => {
    await createUser(app, clientId);
    await createProject(app, new ProjectCode('code'), clientId);

    const createdProject = (
      await request(app.getHttpServer())
        .get(`/project/code`)
        .set('Content-Type', 'application/json')
        .accept('application/json')
    ).body;

    expect(createdProject.code).toEqual('code');
    expect(createdProject.status).toEqual(ProjetStatus.Active);
  });

  it(`Can deactivate a project`, async () => {
    const repo: ProjectRepository = app.get('IRepoProject');
    const project = new Project(
      new ProjectCode('projetTest'),
      [],
      '',
      '',
      new Date(),
      ProjetStatus.Active,
    );
    await repo.save(project);

    const response = await request(app.getHttpServer())
      .post(`/project/desactivate/projetTest`)
      .set('Content-Type', 'application/json')
      .accept('application/json')
      .send();

    expect(response.status).toBe(HttpStatus.CREATED);

    const actualProject = await repo.findById(new ProjectCode('projetTest'));
    expect(actualProject.status).toBe(ProjetStatus.Desactive);
  });

  it('Does not allow to add a non existing user to a an existing project', async () => {
    const projectDto = badProject();

    await createUser(app, clientId);

    const response = await request(app.getHttpServer())
      .put(`/project/update`)
      .set('Content-Type', 'application/json')
      .accept('application/json')
      .send(projectDto);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  function badProject() {
    const projectDto = new ProjectDto();
    projectDto.name = 'New project';
    projectDto.status = ProjetStatus.Active;
    projectDto.collabs = ['unknown@proxym.fr', clientId.value];
    projectDto.code = 'new_proj_01';
    projectDto.client = 'axa';
    return projectDto;
  }

  it('Does not allow to create a project with a non existing user', async () => {
    const projectDto = badProject();

    await createUser(app, clientId);

    const response = await request(app.getHttpServer())
      .post(`/project/add`)
      .set('Content-Type', 'application/json')
      .accept('application/json')
      .send(projectDto);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });
});
