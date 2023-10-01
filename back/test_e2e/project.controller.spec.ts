import { createProject, createUser } from './test.utils';
import { ProjectController } from '@app/controllers/project.controller';
import { ProjetStatus } from '@app/domain/model/projetStatus.enum';
import { ProjectRepository } from '@app/repositories/project.repository';
import { CraApplication } from '@app/domain/application/craApplication';
import { Project } from '@app/domain/model/Project';
import { ProjectCode } from '@app/domain/model/project.code';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@app/app.module';
import { MongoClientWrapper } from '@app/mongo/mongo.client.wrapper';
import { CollabEmail } from '@app/domain/model/collab.email';
import { ProjectDto } from '@app/dtos/project.dto';

describe('Project controller', () => {
  let app: INestApplication;
  let moduleRef: TestingModule = null;
  const clientId = new CollabEmail('test1@proxym.fr');
  let projectController: ProjectController;

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
    projectController = app.get(ProjectController);
  });

  it(`create project`, async () => {
    await createUser(app, clientId);
    await createProject(app, clientId);

    const createdProject = await projectController.getById('code');

    expect(createdProject.code).toEqual('code');
    expect(createdProject.status).toEqual(ProjetStatus.Active);
  });

  it(`delete project`, async () => {
    const repo: ProjectRepository = app.get('IRepoProject');
    const application = app.get(CraApplication);
    const project = new Project(
      new ProjectCode('projetTest'),
      [],
      '',
      '',
      new Date(),
      ProjetStatus.Active,
    );
    await repo.save(project);

    await application.deleteProject(new ProjectCode('projetTest'));

    await expect(
      repo.findById(new ProjectCode('projetTest')),
    ).rejects.toThrowError('Project not found');
  });

  it('Does not allow to add a non existing user to a project', async () => {
    const projectDto = new ProjectDto();
    projectDto.name = 'New project';
    projectDto.status = ProjetStatus.Active;
    projectDto.collabs = ['unknown@proxym.fr', clientId.value];
    projectDto.code = 'new_proj_01';
    projectDto.client = 'axa';

    await createUser(app, clientId);

    await expect(projectController.addProject(projectDto)).rejects.toThrow();
  });
});
