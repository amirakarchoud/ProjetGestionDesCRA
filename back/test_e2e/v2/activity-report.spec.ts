import { DateProvider } from '../../src/domain/model/date-provider';
import { ProjectActivitiesDto } from '../../src/dtos/activity.dto';
import { createProject, createUser, prepareApp } from '../test.utils';
import { ProjectCode } from '../../src/domain/model/project.code';
import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { CraApplication } from '../../src/domain/application/cra.application';
import { CollabEmail } from '../../src/domain/model/collab.email';
import { ActivityReportDto } from '../../src/controllers/v2/dto/activity-report.dto';
import { prepareActivities } from '../cra.controller.spec';
import { LocalDate, Month } from '@js-joda/core';

describe('Activity Report Controller', () => {
  const getApp = prepareApp('activity_report');

  it('Can post cra activities in bulk', async () => {
    const date = LocalDate.parse('2023-11-02');
    const nextDate = LocalDate.parse('2023-11-03');
    DateProvider.setTodayDate(LocalDate.parse('2023-11-02'));

    const activities: ProjectActivitiesDto[] = prepareActivities(
      date,
      nextDate,
    );

    const collabEmail = new CollabEmail('aleksandar@proxym.fr');
    await createUser(getApp(), collabEmail);
    await createProject(getApp(), new ProjectCode('proj1'), collabEmail);
    await createProject(getApp(), new ProjectCode('proj2'), collabEmail);

    const dto = new ActivityReportDto();
    dto.month = Month.NOVEMBER.value();
    dto.year = 2023;
    dto.collabEmail = collabEmail.value;
    dto.activities = activities;

    const response = await request(getApp().getHttpServer())
      .post('/v2/private/activity-report/')
      .set('Content-Type', 'application/json')
      .send(dto);

    expect(response.status).toBe(HttpStatus.CREATED);

    const application = getApp().get(CraApplication);

    const cra = await application.getCraByCollabMonthYear(
      collabEmail,
      Month.NOVEMBER,
      2023,
    );

    expect(cra.activities).toHaveLength(2);
    expect(cra.absences).toHaveLength(2);
    expect(cra.holidays).toHaveLength(2);
  });
});
