import {
  createProject,
  createUser,
  prepareAbsence,
  prepareActivity,
} from './test.utils';
import { CollabEmail } from '@app/domain/model/collab.email';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@app/app.module';
import { INestApplication } from '@nestjs/common';
import { CraController } from '@app/controllers/cra.controller';
import { MongoClientWrapper } from '@app/mongo/mongo.client.wrapper';
import { ActivityDtoType, ProjectActivitiesDto } from '@app/dtos/activity.dto';
import { Raison } from '@app/domain/model/Raison';
import { CraApplication } from '@app/domain/application/craApplication';
import { ProjectCode } from '@app/domain/model/project.code';
import { DateProvider } from '@app/domain/model/date-provider';
import { CraRepository } from '@app/repositories/cra.repository';

describe('CRA Controller', () => {
  let app: INestApplication;
  let moduleRef: TestingModule = null;
  const clientId = new CollabEmail('test1@proxym.fr');
  let craController: CraController;

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

    craController = app.get(CraController);
  });

  it('can be found by month and year', async () => {
    const date = new Date();
    await prepareAbsence(app, date, clientId);
    const cra = await craController.getMonthCra(
      date.getMonth() + 1,
      date.getFullYear(),
    );
    expect(cra).toHaveLength(1);
  });

  it('can be found by year for a user', async () => {
    const date = new Date();
    await prepareAbsence(app, date, clientId);
    await prepareAbsence(app, date, new CollabEmail('seconduser@proxym.fr'));

    const cra = await craController.userYearCra(
      clientId.value,
      date.getFullYear(),
    );
    expect(cra).toHaveLength(1);
  });

  const collabEmail = new CollabEmail('aleksandar.kirilov@proxym.fr');
  it('Can post cra activities by week', async () => {
    const date = new Date('2023-09-02');
    const nextDate = new Date('2023-09-03');
    DateProvider.setTodayDate(new Date('2023-09-02'));

    const activities: ProjectActivitiesDto[] = [
      {
        projectCode: 'proj1',
        activities: [
          {
            date: date,
            type: ActivityDtoType.absence,
            percentage: 50,
            title: Raison.Maladie,
          },
          {
            date: date,
            type: ActivityDtoType.project,
            title: 'Fnac',
            percentage: 50,
          },
        ],
      },
      {
        projectCode: 'proj2',
        activities: [
          {
            date: nextDate,
            type: ActivityDtoType.absence,
            percentage: 50,
            title: Raison.RTT,
          },
          {
            date: nextDate,
            type: ActivityDtoType.project,
            title: 'Darty',
            percentage: 50,
          },
        ],
      },
    ];

    await createUser(app, collabEmail);
    await createProject(app, new ProjectCode('proj1'), collabEmail);
    await createProject(app, new ProjectCode('proj2'), collabEmail);

    await craController.postWeek(
      'aleksandar.kirilov@proxym.fr',
      2023,
      35,
      activities,
    );

    const application = app.get(CraApplication);

    const cra = await application.getCraByCollabMonthYear(collabEmail, 9, 2023);

    expect(cra.activities).toHaveLength(2);
    expect(cra.absences).toHaveLength(2);
  });

  it('Will replace an existing week', async () => {
    DateProvider.setTodayDate(new Date('2023-09-04'));

    await createUser(app, collabEmail);
    await createProject(app, new ProjectCode('proj1'), collabEmail);

    const date = new Date('2023-09-04'); // week 36
    const nextDate = new Date('2023-09-05'); // week 36
    const nextNextDate = new Date('2023-09-06'); // week 36

    const repo: CraRepository = app.get('IRepoCra');
    await prepareActivity(app, date, collabEmail, false);
    // await prepareActivity(app, nextDate, collabEmail, false);
    await prepareAbsence(app, nextNextDate, collabEmail, false);

    const activities: ProjectActivitiesDto[] = [
      {
        projectCode: 'proj1',
        activities: [
          {
            date: date,
            type: ActivityDtoType.absence,
            percentage: 50,
            title: Raison.Maladie,
          },
        ],
      },
    ];

    await craController.postWeek(
      'aleksandar.kirilov@proxym.fr',
      2023,
      35,
      activities,
    );

    const cra = (
      await repo.findByYearUser(
        new CollabEmail('aleksandat.kirilov@proxym.fr'),
        2023,
      )
    )[0];

    expect(cra.activities.length).toBe(0);
    expect(cra.absences.length).toBe(1);
  });
});
