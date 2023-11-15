import { createProject, createUser, prepareAbsence, prepareActivity } from './test.utils';
import { CollabEmail } from '@app/domain/model/collab.email';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@app/app.module';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { MongoClientWrapper } from '@app/mongo/mongo.client.wrapper';
import { ActivityDtoType, ProjectActivitiesDto } from '@app/dtos/activity.dto';
import { Raison } from '@app/domain/model/Raison';
import { ProjectCode } from '@app/domain/model/project.code';
import { DateProvider } from '@app/domain/model/date-provider';
import { CraRepository } from '@app/repositories/cra.repository';
import { CraApplication } from '@app/domain/application/cra.application';
import * as request from 'supertest';
import superdebug from 'superagent-debugger';

describe('CRA Controller', () => {
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

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    await app.init();

    const wrapper: MongoClientWrapper = app.get(MongoClientWrapper);
    await wrapper.db.dropDatabase();
  });

  it('can be found by month and year', async () => {
    const date = new Date('2023-09-04');
    DateProvider.setTodayDate(date);

    await prepareAbsence(app, date, clientId);

    const response = await request(app.getHttpServer()).get(
      `/cra/monthCra/${date.getMonth() + 1}/${date.getFullYear()}`,
    );

    expect(response.body).toHaveLength(1);
  });

  it('can be found by year for a user', async () => {
    const date = new Date('2023-09-04');
    DateProvider.setTodayDate(date);

    await prepareAbsence(app, date, clientId);
    await prepareAbsence(app, date, new CollabEmail('seconduser@proxym.fr'));

    const response = await request(app.getHttpServer()).get(
      `/cra/userYear/${clientId.value}/${date.getFullYear()}`,
    );

    expect(response.body).toHaveLength(1);
  });

  const collabEmail = new CollabEmail('aleksandar.kirilov@proxym.fr');

  it('Can post cra activities in bulk', async () => {
    const date = new Date('2023-09-02');
    const nextDate = new Date('2023-09-03');
    DateProvider.setTodayDate(new Date('2023-09-02'));

    const activities: ProjectActivitiesDto[] = prepareActivities(
      date,
      nextDate,
    );

    await createUser(app, collabEmail);
    await createProject(app, new ProjectCode('proj1'), collabEmail);
    await createProject(app, new ProjectCode('proj2'), collabEmail);

    const response = await request(app.getHttpServer())
      .post(`/cra/user/${collabEmail.value}/2023/9`)
      .use(superdebug(console.info))
      .set('Content-Type', 'application/json')
      .send(activities);

    expect(response.status).toBe(HttpStatus.CREATED);

    const application = app.get(CraApplication);

    const cra = await application.getCraByCollabMonthYear(collabEmail, 9, 2023);

    expect(cra.activities).toHaveLength(2);
    expect(cra.absences).toHaveLength(2);
  });

  it('Can bulk add in replace mode', async () => {
    DateProvider.setTodayDate(new Date('2023-09-04'));

    await createUser(app, collabEmail);
    await createProject(app, new ProjectCode('proj1'), collabEmail);

    const date = new Date('2023-09-04'); // week 36

    const repo: CraRepository = app.get('IRepoCra');
    await prepareActivity(app, date, collabEmail, false);
    await prepareAbsence(app, date, collabEmail, false);

    const activities: ProjectActivitiesDto[] = [
      {
        projectCode: 'proj1',
        activities: [
          {
            date: date,
            type: ActivityDtoType.absence,
            percentage: 50,
            title: Raison.Maladie,
            reason: Raison.Maladie,
          },
        ],
      },
    ];

    const response = await request(app.getHttpServer())
      .post(`/cra/user/${collabEmail.value}/2023/9`)
      .use(superdebug(console.info))
      .set('Content-Type', 'application/json')
      .send(activities);

    expect(response.status).toBe(HttpStatus.CREATED);

    const cra = (
      await repo.findByYearUser(
        new CollabEmail('aleksandar.kirilov@proxym.fr'),
        2023,
      )
    )[0];

    expect(cra.activities.length).toBe(0);
    expect(cra.absences.length).toBe(1);
  });
});

export const prepareActivities = (date: Date, nextDate: Date): any[] => {
  return [
    {
      projectCode: 'proj1',
      activities: [
        {
          date: date,
          type: ActivityDtoType.absence,
          percentage: 50,
          title: Raison.Maladie,
          reason: Raison.Maladie,
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
          reason: Raison.Maladie,
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
};
