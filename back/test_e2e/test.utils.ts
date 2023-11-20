import { INestApplication, ValidationPipe } from '@nestjs/common';
import { CreateActivityDto } from '@app/dtos/CreateActivityDto';
import { Project } from '@app/domain/model/Project';
import { ProjetStatus } from '@app/domain/model/projetStatus.enum';
import { CreateAbsenceDto } from '@app/dtos/CreateAbsenceDto';
import { Raison } from '@app/domain/model/Raison';
import { CollabRepository } from '@app/repositories/collab.repository';
import { ProjectRepository } from '@app/repositories/project.repository';
import { Collab } from '@app/domain/model/Collab';
import { Role } from '@app/domain/model/Role';
import { ProjectCode } from '@app/domain/model/project.code';
import { CollabEmail } from '@app/domain/model/collab.email';
import { CraApplication } from '@app/domain/application/cra.application';
import { LocalDate } from '@js-joda/core';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoClientWrapper } from '@app/mongo/mongo.client.wrapper';
import { AppModule } from '@app/app.module';

export const prepareApp = (testName: string) => {
  let app: INestApplication;
  let moduleRef: TestingModule = null;
  process.env.MONGO_DB = `cra_test_${testName}`;

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

  afterEach(async () => {
    const wrapper: MongoClientWrapper = app.get(MongoClientWrapper);
    await wrapper.db.dropDatabase();
  });

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    const validationPipe = new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      transformOptions: { enableImplicitConversion: true },
    });

    app.useGlobalPipes(validationPipe);

    await app.init();
  });

  return () => app;
};

export async function prepareActivity(
  app: INestApplication,
  date: LocalDate,
  clientId: CollabEmail,
  insertUser = true,
) {
  if (insertUser) {
    await createUser(app, clientId);
  }
  const application = app.get(CraApplication);
  const activity = new CreateActivityDto();
  const project = await createProject(app, new ProjectCode('code'), clientId);
  activity.date = date.toString();
  activity.projectId = project.code.value;
  activity.collabId = clientId.value;
  activity.percentage = 100;
  await application.addActivity(activity);
  return activity;
}

export async function createProject(
  app: INestApplication,
  code: ProjectCode,
  clientId?: CollabEmail,
) {
  const repo: ProjectRepository = app.get('IRepoProject');
  const repoCollab: CollabRepository = app.get('IRepoCollab');
  let project: Project;

  if (clientId) {
    const createdUser = await repoCollab.findById(clientId);
    project = new Project(
      code,
      [createdUser.email],
      '',
      '',
      LocalDate.now(),
      ProjetStatus.Active,
    );
  } else {
    project = new Project(
      code,
      [],
      '',
      '',
      LocalDate.now(),
      ProjetStatus.Active,
    );
  }
  await repo.save(project);
  return project;
}

export async function createUser(app: INestApplication, userId: CollabEmail) {
  const repo: CollabRepository = app.get('IRepoCollab');
  await repo.save(new Collab(userId, 'some name', 'last name', Role.user));

  return repo.findById(userId);
}

export async function prepareAbsence(
  app: INestApplication,
  date: LocalDate,
  clientId: CollabEmail,
  insertUser = true,
) {
  if (insertUser) {
    await createUser(app, clientId);
  }

  const application = app.get(CraApplication);
  const absence = new CreateAbsenceDto();
  absence.date = date.toString();
  absence.percentage = 0;
  absence.raison = Raison.Maladie;

  absence.collabId = clientId.value;
  await application.addAbsence(absence);
  return absence;
}
