import 'reflect-metadata';
import { State } from '@app/domain/model/State.enum';
import { Status } from '@app/domain/model/Status';
import { CollabEmail } from '@app/domain/model/collab.email';
import { ProjectCode } from '@app/domain/model/project.code';
import { Project } from '@app/domain/model/Project';
import { ProjectStatus } from '@app/domain/model/projetStatus.enum';
import { Absence } from '@app/domain/model/Absence';
import { Raison } from '@app/domain/model/Raison';
import { Holiday } from '@app/domain/model/Holiday';
import { mapCraToCraDto } from '@app/mappers/cra-dto.mapper';
import { createCra } from './utils';
import { Collab } from '@app/domain/model/Collab';
import { Role } from '@app/domain/model/Role';
import { LocalDate } from '@js-joda/core';
import { ProjectActivity } from '@app/domain/model/ProjectActivity';

describe('Cra DTO Mapper', () => {
  let date;
  const projects = [
    new Project(
      new ProjectCode('proj1'),
      [new CollabEmail('aleks@proxym.fr')],
      'name 1',
      'fnac',
      LocalDate.now(),
      ProjectStatus.Active,
    ),
  ];
  const collab = new Collab(
    new CollabEmail('user@proxym.fr'),
    'test',
    'last name',
    Role.admin,
  );

  let cra;

  beforeEach(() => {
    date = LocalDate.parse('2023-09-04');
    cra = createCra(collab, date);
  });

  it('Should map basic cra properties', () => {
    // when
    const craDto = mapCraToCraDto(cra, []);

    //then
    expect(craDto).toEqual(
      expect.objectContaining({
        id: '9-2023-user@proxym.fr',
        month: 9,
        year: 2023,
        collab: 'user@proxym.fr',
        state: State.Draft,
        status: Status.Open,
      }),
    );
  });

  it('Should map activities', () => {
    const activity = new ProjectActivity(new ProjectCode('proj1'), 75, date);
    cra.addActivity(activity);

    const craDto = mapCraToCraDto(cra, projects);

    expect(craDto.activites).toEqual([
      expect.objectContaining({
        name: 'proj1',
        percentage: 75,
        date: date.toString(),
        project: expect.objectContaining({
          code: 'proj1',
          name: 'name 1',
          client: 'fnac',
          status: ProjectStatus.Active,
        }),
      }),
    ]);
  });

  it('Should map absences', () => {
    const absence = new Absence(
      25,
      LocalDate.parse('2023-09-20'),
      Raison.Maladie,
    );
    cra.addActivity(absence);

    const craDto = mapCraToCraDto(cra, projects);

    expect(craDto.absences).toEqual([
      expect.objectContaining({
        name: 'maladie',
        percentage: 25,
        date: LocalDate.parse('2023-09-20').toString(),
        reason: 'maladie',
      }),
    ]);
  });

  it('Should map holidays', () => {
    const today = LocalDate.parse('2023-01-01');
    cra = createCra(collab, today);

    cra.holidays = [new Holiday(LocalDate.parse('2023-01-01'), 'New Years')];
    const craDto = mapCraToCraDto(cra, projects);

    expect(craDto.holidays).toEqual([
      expect.objectContaining({
        name: 'New Years',
        percentage: 100,
        date: today.toString(),
      }),
    ]);
  });

  it('Should map available dates', () => {
    const nextDate = LocalDate.parse('2023-09-04');
    const nextDate2 = LocalDate.parse('2023-09-05');
    const nextDate3 = LocalDate.parse('2023-09-06');

    const absence = new Absence(100, nextDate, Raison.Maladie);
    const activity = new ProjectActivity(
      new ProjectCode('proj1'),
      75,
      nextDate2,
    );

    cra['_holidays'] = [new Holiday(nextDate3, 'New Years')];

    cra.addActivity(absence);
    cra.addActivity(activity);

    const craDto = mapCraToCraDto(cra, projects);

    expect(craDto.availableDates.length).toEqual(19);
    expect(craDto.availableDates[1].availableTime).toEqual(25);
  });
});
