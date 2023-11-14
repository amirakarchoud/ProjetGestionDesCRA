import { DateProvider } from '../../src/domain/model/date-provider';
import { ProjectActivitiesDto } from '../../src/dtos/activity.dto';
import { createProject, createUser } from '../test.utils';
import { ProjectCode } from '../../src/domain/model/project.code';
import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { CraApplication } from '../../src/domain/application/cra.application';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { MongoClientWrapper } from '../../src/mongo/mongo.client.wrapper';
import { CollabEmail } from '../../src/domain/model/collab.email';
import { ActivityReportDto } from '../../src/controllers/v2/dto/activity-report.dto';
import { prepareActivities } from '../cra.controller.spec';

const prepareApp = () => {
  let app: INestApplication;
  let moduleRef: TestingModule = null;

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

  return () => app;
};

describe('Activity Report Controller', () => {
  const getApp = prepareApp();

  it('Can post cra activities in bulk', async () => {
    const date = new Date('2023-09-02');
    const nextDate = new Date('2023-09-03');
    DateProvider.setTodayDate(new Date('2023-09-02'));

    const activities: ProjectActivitiesDto[] = prepareActivities(
      date,
      nextDate,
    );

    const collabEmail = new CollabEmail('aleksandar@proxym.fr');
    await createUser(getApp(), collabEmail);
    await createProject(getApp(), new ProjectCode('proj1'), collabEmail);
    await createProject(getApp(), new ProjectCode('proj2'), collabEmail);

    const dto = new ActivityReportDto();
    dto.month = 9;
    dto.year = 2023;
    dto.collabEmail = collabEmail.value;
    dto.activities = activities;

    const response = await request(getApp().getHttpServer())
      .post('/v2/private/activity-report/')
      .set('Content-Type', 'application/json')
      .send(dto);

    expect(response.status).toBe(HttpStatus.CREATED);

    const application = getApp().get(CraApplication);

    const cra = await application.getCraByCollabMonthYear(collabEmail, 9, 2023);

    expect(cra.activities).toHaveLength(2);
    expect(cra.absences).toHaveLength(2);
  });
});
