import 'reflect-metadata';
import { Etat } from '@app/domain/model/etat.enum';
import { Status } from '@app/domain/model/Status';
import { CollabEmail } from '@app/domain/model/collab.email';
import { Activity } from '@app/domain/model/Activity';
import { ProjectCode } from '@app/domain/model/project.code';
import { Project } from '@app/domain/model/Project';
import { ProjetStatus } from '@app/domain/model/projetStatus.enum';
import { Absence } from '@app/domain/model/Absence';
import { Raison } from '@app/domain/model/Raison';
import { Holiday } from '@app/domain/model/Holiday';
import { mapCraToCraDto } from '@app/mappers/cra-dto.mapper';
import { createCra } from './utils';
import { Collab } from '@app/domain/model/Collab';
import { Role } from '@app/domain/model/Role';

describe('Cra DTO Mapper', () => {
  let date;
  const projects = [
    new Project(
      new ProjectCode('proj1'),
      [new CollabEmail('aleks@proxym.fr')],
      'name 1',
      'fnac',
      new Date(),
      ProjetStatus.Active,
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
    date = new Date('2023/09/02');
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
        etat: Etat.unsubmitted,
        status: Status.Open,
      }),
    );
  });

  it('Should map activities', () => {
    const activity = new Activity(new ProjectCode('proj1'), 75, date);
    cra.addActivity(activity);

    const craDto = mapCraToCraDto(cra, projects);

    expect(craDto.activites).toEqual([
      expect.objectContaining({
        title: 'proj1',
        percentage: 75,
        date: date,
        type: 'Project',
        project: expect.objectContaining({
          code: 'proj1',
          name: 'name 1',
          client: 'fnac',
          status: ProjetStatus.Active,
        }),
      }),
    ]);
  });

  it('Should map absences', () => {
    const absence = new Absence(25, new Date('2023-09-20'), Raison.Maladie);
    cra.addAbsence(absence);

    const craDto = mapCraToCraDto(cra, projects);

    expect(craDto.absences).toEqual([
      expect.objectContaining({
        title: 'Maladie',
        percentage: 25,
        type: 'Absence',
        date: new Date('2023-09-20'),
        reason: 'Maladie',
      }),
    ]);
  });

  it('Should map holidays', () => {
    const today = new Date('2023-01-01');
    cra = createCra(collab, today);

    cra.holidays = [
      new Holiday(
        new Date(today.getTime() - today.getTimezoneOffset() * 60 * 1000),
        'New Years',
      ),
    ];
    const craDto = mapCraToCraDto(cra, projects);

    expect(craDto.holidays).toEqual([
      expect.objectContaining({
        title: 'New Years',
        percentage: 100,
        type: 'Holiday',
        date: new Date(today.getTime() - today.getTimezoneOffset() * 60 * 1000),
      }),
    ]);
  });

  it('Should map available dates', () => {
    const nextDate = new Date('2023-09-04');
    const nextDate2 = new Date('2023-09-05');
    const nextDate3 = new Date('2023-09-06');

    const absence = new Absence(100, nextDate, Raison.Maladie);
    const activity = new Activity(new ProjectCode('proj1'), 75, nextDate2);

    cra['_holidays'] = [new Holiday(nextDate3, 'New Years')];

    cra.addAbsence(absence);
    cra.addActivity(activity);

    const craDto = mapCraToCraDto(cra, projects);

    expect(craDto.availableDates.length).toEqual(18);
  });
});
