import {
  createProject,
  createUser,
  prepareAbsence,
  prepareActivity,
  prepareApp,
} from './test.utils';
import { CollabEmail } from '@app/domain/model/collab.email';
import { HttpStatus } from '@nestjs/common';
import { ActivityDtoType, ProjectActivitiesDto } from '@app/dtos/activity.dto';
import { Raison } from '@app/domain/model/Raison';
import { ProjectCode } from '@app/domain/model/project.code';
import { DateProvider } from '@app/domain/model/date-provider';
import { CraRepository } from '@app/repositories/cra.repository';
import { CraApplication } from '@app/domain/application/cra.application';
import * as request from 'supertest';
import superdebug from 'superagent-debugger';
import { LocalDate, Month } from '@js-joda/core';

describe('CRA Controller', () => {
  const app = prepareApp('cra_controller');
  const clientId = new CollabEmail('test1@proxym.fr');

  it('can be found by month and year', async () => {
    const date = LocalDate.parse('2023-09-04');
    DateProvider.setTodayDate(date);

    await prepareAbsence(app(), date, clientId);

    const response = await request(app().getHttpServer()).get(
      `/cra/monthCra/${date.month().value()}/${date.year()}`,
    );

    expect(response.body).toHaveLength(1);
  });

  it('can be found by year for a user', async () => {
    const date = LocalDate.parse('2023-09-04');
    DateProvider.setTodayDate(date);

    await prepareAbsence(app(), date, clientId);
    await prepareAbsence(app(), date, new CollabEmail('seconduser@proxym.fr'));

    const response = await request(app().getHttpServer()).get(
      `/cra/userYear/${clientId.value}/${date.year()}`,
    );

    expect(response.body).toHaveLength(1);
  });

  const collabEmail = new CollabEmail('aleksandar.kirilov@proxym.fr');

  it('Can post cra activities in bulk', async () => {
    const date = LocalDate.parse('2023-09-04');
    const nextDate = date.plusDays(1);
    DateProvider.setTodayDate(date);

    const activities: ProjectActivitiesDto[] = prepareActivities(
      date,
      nextDate,
    );

    await createUser(app(), collabEmail);
    await createProject(app(), new ProjectCode('proj1'), collabEmail);
    await createProject(app(), new ProjectCode('proj2'), collabEmail);

    const response = await request(app().getHttpServer())
      .post(`/cra/user/${collabEmail.value}/2023/9`)
      .use(superdebug(console.info))
      .set('Content-Type', 'application/json')
      .send(activities);

    expect(response.status).toBe(HttpStatus.CREATED);

    const application = app().get(CraApplication);

    const cra = await application.getCraByCollabMonthYear(
      collabEmail,
      Month.SEPTEMBER,
      2023,
    );

    expect(cra.activities).toHaveLength(2);
    expect(cra.absences).toHaveLength(2);
  });

  it('Can bulk add in replace mode', async () => {
    DateProvider.setTodayDate(LocalDate.parse('2023-09-04'));

    await createUser(app(), collabEmail);
    await createProject(app(), new ProjectCode('proj1'), collabEmail);

    const date = LocalDate.parse('2023-09-04'); // week 36

    const repo: CraRepository = app().get('IRepoCra');
    await prepareActivity(app(), date, collabEmail, false);
    await prepareAbsence(app(), date, collabEmail, false);

    const activities: ProjectActivitiesDto[] = [
      {
        projectCode: 'proj1',
        activities: [
          {
            date: date.toString(),
            type: ActivityDtoType.absence,
            percentage: 50,
            title: Raison.Maladie,
            reason: Raison.Maladie,
          },
        ],
      },
    ];

    const response = await request(app().getHttpServer())
      .post(`/cra/user/${collabEmail.value}/2023/9`)
      .use(superdebug(console.info))
      .set('Content-Type', 'application/json')
      .query({ replace: true })
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

export const prepareActivities = (
  date: LocalDate,
  nextDate: LocalDate,
): any[] => {
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
