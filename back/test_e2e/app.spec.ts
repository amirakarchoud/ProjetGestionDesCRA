import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CraApplication } from '../src/domain/application/craApplication';
import { RepoCollab } from '../src/data/Repository/RepoCollab';
import { AppModule } from '../src/app.module';
import { Project } from '../src/domain/model/Project';
import { RepoProject } from '../src/data/Repository/RepoProject';
import { RepoCra } from '../src/data/Repository/RepoCra';
import { Raison } from '../src/domain/model/Raison';
import { CreateAbsenceDto } from '../src/Dto/CreateAbsenceDto';
import { CreateActivityDto } from '../src/Dto/CreateActivityDto';

describe('APP', () => {
  let app: INestApplication;
  let moduleRef: TestingModule = null;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    await createUser(app);
  });

  it(`create user from token`, async () => {
    const repo: RepoCollab = await createUser(app);
    const createdUser = await repo.findById('test1');
    expect(createdUser).toBeDefined();
  });

  it(`create project`, async () => {
    const project = await createProject(app);
    expect(project).toBeDefined();
  });

  it(`delete project`, async () => {
    const repo: RepoProject = app.get('IRepoProject');
    const application = app.get(CraApplication);
    const project = new Project('projetTest', []);
    await repo.save(project);
    expect(project).toBeDefined();
    await application.deleteProject('projetTest');
    await expect(repo.findById('projetTest')).rejects.toThrowError(
      'Project not found',
    );
  });

  it(`create absence`, async () => {
    const date = new Date();
    const repo = app.get('IRepoCra');
    await prepareAbsence(app);
    const cra = await repo.findByMonthYearCollab(
      date.getMonth() + 1,
      date.getFullYear(),
      'test1',
    );
    expect(cra.absences).toHaveLength(1);
  });

  it(`delete absence`, async () => {
    const date = new Date();
    const repo: RepoCra = app.get('IRepoCra');
    const absence = await prepareAbsence(app);
    const application = app.get(CraApplication);
    const cra = await repo.findByMonthYearCollab(
      date.getMonth() + 1,
      date.getFullYear(),
      'test1',
    );
    await application.deleteAbsence(cra.id, date, absence.matin);
    const craAfter = await repo.findByMonthYearCollab(
      date.getMonth() + 1,
      date.getFullYear(),
      'test1',
    );
    expect(craAfter.absences).toHaveLength(0);
  });

  it(`create activity`, async () => {
    const date = new Date();
    const repo: RepoCra = app.get('IRepoCra');
    await prepareActivity(app, date);
    const craAfter = await repo.findByMonthYearCollab(
      date.getMonth() + 1,
      date.getFullYear(),
      'test1',
    );
    expect(craAfter.activities).toHaveLength(1);
  });

  afterAll(async () => {
    await app.close();
  });

  it(`delete activity`, async () => {
    const date = new Date();
    const repo: RepoCra = app.get('IRepoCra');
    const activity = await prepareActivity(app, date);
    const application = app.get(CraApplication);
    const cra = await repo.findByMonthYearCollab(
      date.getMonth() + 1,
      date.getFullYear(),
      'test1',
    );
    await application.deleteActivity(cra.id, date, activity.matin);
    const craAfter = await repo.findByMonthYearCollab(
      date.getMonth() + 1,
      date.getFullYear(),
      'test1',
    );
    expect(craAfter.activities).toHaveLength(0);
  });

  it(`create regul for absence creation`, async () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const repo: RepoCra = app.get('IRepoCra');
    await prepareActivity(app, date);
    const cra = await repo.findByMonthYearCollab(
      date.getMonth() + 1,
      date.getFullYear(),
      'test1',
    );
    const historyAvant = cra.history.length;
    cra.closeCra();
    await repo.save(cra);
    await prepareAbsence(app);
    const craAfter = await repo.findByMonthYearCollab(
      date.getMonth() + 1,
      date.getFullYear(),
      'test1',
    );
    expect(craAfter.history).toHaveLength(historyAvant + 1);
  });

  it(`create regul pour creation activite`, async () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const repo: RepoCra = app.get('IRepoCra');
    await prepareAbsence(app);
    const cra = await repo.findByMonthYearCollab(
      date.getMonth() + 1,
      date.getFullYear(),
      'test1',
    );
    const historyAvant = cra.history.length;
    cra.closeCra();
    await repo.save(cra);
    await prepareActivity(app, date);
    const craAfter = await repo.findByMonthYearCollab(
      date.getMonth() + 1,
      date.getFullYear(),
      'test1',
    );
    expect(craAfter.history).toHaveLength(historyAvant + 1);
  });
});

async function prepareActivity(app: INestApplication, date: Date) {
  const application = app.get(CraApplication);
  const activity = new CreateActivityDto();
  const project = await createProject(app);
  activity.date = date;
  activity.matin = true;
  activity.projectId = project.code;
  activity.craId = 1;
  activity.collabId = 'test1';
  await application.addActivity(activity);
  return activity;
}

async function createProject(app: INestApplication) {
  const repo: RepoProject = app.get('IRepoProject');
  const repoCollab: RepoCollab = app.get('IRepoCollab');
  const createdUser = await repoCollab.findById('test1');
  const project = new Project('code', [createdUser.email]);
  await repo.save(project);
  return project;
}

async function createUser(app: INestApplication) {
  const repo: RepoCollab = app.get('IRepoCollab');
  const application = app.get(CraApplication);

  await application.addUser('token');
  return repo;
}

async function prepareAbsence(app: INestApplication) {
  const date = new Date();
  const application = app.get(CraApplication);
  const absence = new CreateAbsenceDto();
  absence.date = date;
  absence.matin = false;
  absence.raison = Raison.Maladie;
  absence.craId = 1;

  absence.collabId = 'test1';
  await application.addAbsence(absence);
  return absence;
}
