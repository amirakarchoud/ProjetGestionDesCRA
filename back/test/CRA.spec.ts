import { Project } from '@app/domain/model/Project';
import { Absence } from '@app/domain/model/Absence';
import { Collab } from '@app/domain/model/Collab';
import { Raison } from '@app/domain/model/Raison';
import { Role } from '@app/domain/model/Role';
import { Activity } from '@app/domain/model/Activity';
import { Etat } from '@app/domain/model/etat.enum';
import { ForbiddenException } from '@nestjs/common';
import { Holiday } from '@app/domain/model/Holiday';
import { Status } from '@app/domain/model/Status';
import { Action } from '@app/domain/model/action.enum';
import { ProjetStatus } from '@app/domain/model/projetStatus.enum';
import { ProjectCode } from '@app/domain/model/project.code';
import { CollabEmail } from '@app/domain/model/collab.email';
import { DateProvider } from '@app/domain/model/date-provider';
import { createCra } from './utils';
import { LocalDate, Month } from '@js-joda/core';

const createProject = (code: ProjectCode, collab?: CollabEmail) => {
  return new Project(
    new ProjectCode('123'),
    [collab],
    '',
    '',
    LocalDate.now(),
    ProjetStatus.Active,
  );
};

describe('Un CRA ', () => {
  const project1 = createProject(new ProjectCode('123'));
  const project2 = createProject(new ProjectCode('321'));

  const collab = new Collab(
    new CollabEmail('user@proxym.fr'),
    'test',
    'last name',
    Role.admin,
  );

  it('peut supprimer des absences', () => {
    //given
    const today = LocalDate.parse('2023-09-04');
    const cra = createCra(collab, today);
    cra.addAbsence(new Absence(50, today, Raison.Maladie));

    expect(cra.absences.length).toBe(1);
    //when
    cra.deleteAbsence(today, Raison.Maladie);
    //then
    expect(cra.absences.length).toBe(0);
  });

  it('ne peut pas contenir plus de 100 pourcents d activité pour une journée', () => {
    //Given
    const date = LocalDate.parse('2023-09-04');
    const cra = createCra(collab, date);

    project1.addCollab(collab.email);
    const activity = new Activity(project1.code, 50, date);
    const absence = new Absence(75, date, Raison.Maladie);

    //When
    cra.addActivity(activity);

    //Then
    expect(() => {
      cra.addAbsence(absence);
    }).toThrow(Error('FULL day or period'));
    expect(cra.activities).toHaveLength(1);
  });

  it(`ne peut pas contenir plus que 100 d'activites ou absences par jour`, () => {
    //Given
    const date = LocalDate.parse('2023-09-04');
    const cra = createCra(collab, date);
    project1.addCollab(collab.email);
    const activity = new Activity(project1.code, 50, date);
    const activity2 = new Activity(project2.code, 25, date);
    const absence = new Absence(50, date, Raison.Maladie);

    //When
    cra.addActivity(activity);
    cra.addActivity(activity2);

    //Then
    expect(() => {
      cra.addAbsence(absence);
    }).toThrow(Error('FULL day or period'));
    expect(cra.activities).toHaveLength(2);
    expect(cra.absences.length).toBe(0);
  });

  it('ne peut pas ajouter une absence apres le 5 du mois suivant', () => {
    //Given
    const date = LocalDate.parse('2023-01-01');
    const cra = createCra(collab, date);

    //When
    const absence = new Absence(
      50,
      LocalDate.parse('2023-02-06'),
      Raison.Maladie,
    );

    //Then
    expect(() => {
      cra.addAbsence(absence);
    }).toThrow(ForbiddenException);
  });

  it(' peut ajouter une absence dans le futur', () => {
    //Given
    const date = LocalDate.parse('2023-09-04');
    const cra = createCra(collab, date);

    //When
    const absence = new Absence(
      100,
      LocalDate.parse('2050-06-02'),
      Raison.Maladie,
    );
    cra.addAbsence(absence);

    //Then
    expect(cra.absences).toHaveLength(1);
  });

  it('ne peut pas ajouter une activité dans le futur', () => {
    //Given
    const date = LocalDate.parse('2023-09-04');
    const cra = createCra(collab, date);

    //When
    const activity = new Activity(
      project1.code,
      50,
      LocalDate.parse('2050-06-02'),
    );

    //Then
    expect(() => {
      cra.addActivity(activity);
    }).toThrow(ForbiddenException);
  });

  it("ne peut pas supprimer une absence qui n'existe pas", () => {
    //given
    const today = LocalDate.parse('2023-09-04');
    const cra = createCra(collab, today);
    cra.addAbsence(new Absence(50, today, Raison.Maladie));

    expect(cra.absences.length).toBe(1);
    cra.deleteAbsence(today, Raison.Conges);

    expect(cra.absences.length).toBe(1);
  });

  it('peut ajouter/contenir des activites ', () => {
    //Given
    const today = LocalDate.parse('2023-09-01');

    const cra = createCra(collab, today);
    project1.addCollab(collab.email);
    const activity = new Activity(
      project1.code,
      50,
      LocalDate.parse('2023-09-04'),
    );
    const activity2 = new Activity(
      project2.code,
      50,
      LocalDate.parse('2023-09-05'),
    );

    //When
    cra.addActivity(activity);
    cra.addActivity(activity2);

    //Then
    expect(cra.activities).toHaveLength(2);
  });

  it('peut ajouter/contenir des absences ', () => {
    //Given
    const date = LocalDate.parse('2023-09-01');
    const cra = createCra(collab, date);
    const absence = new Absence(
      50,
      LocalDate.parse('2023-09-04'),
      Raison.Maladie,
    );
    const absence2 = new Absence(50, LocalDate.parse('2023-09-04'), Raison.RTT);

    //When
    cra.addAbsence(absence);
    cra.addAbsence(absence2);

    //Then
    expect(cra.absences).toHaveLength(2);
  });

  it('ne peut pas etre soumis si il contient des jours vides ', () => {
    //Given
    const date = LocalDate.parse('2023-09-01');

    const cra = createCra(collab, date);
    const absence = new Absence(
      50,
      LocalDate.parse('2023-09-04'),
      Raison.Maladie,
    );
    const absence2 = new Absence(
      50,
      LocalDate.parse('2023-09-04'),
      Raison.Maladie,
    );

    //When
    cra.addAbsence(absence);
    cra.addAbsence(absence2);

    //Then
    expect(cra.SubmitCra()).toBe(false);
    expect(cra.etat).toBe(Etat.unsubmitted);
  });

  it('peut être soumis si tous les jours sont remplis', () => {
    // Given
    const startDate = LocalDate.parse('2023-09-01');

    project1.addCollab(collab.email);
    const cra = createCra(collab, startDate);
    const endDate = startDate.plusMonths(1);

    // Fill all days with activities
    let i = 1;
    for (
      let currentDate = startDate;
      currentDate.isBefore(endDate) || currentDate.equals(endDate);
      currentDate = currentDate.plusDays(1)
    ) {
      if (!cra.isWeekend(currentDate)) {
        const abs = new Absence(50, currentDate, Raison.Maladie);
        const act = new Activity(project1.code, 50, currentDate);
        cra.addAbsence(abs);
        cra.addActivity(act);
        i = i + 2;
      }
    }

    // When
    const result = cra.SubmitCra();

    // Then
    expect(result).toBe(true);
    expect(cra.etat).toBe(Etat.submitted);
  });

  it('peut retourner les dates vides', () => {
    // Given
    const startDate = LocalDate.parse('2023-09-01');

    project1.addCollab(collab.email);
    const cra = createCra(collab, startDate);
    const endDate = startDate.plusMonths(1);

    const activity = new Activity(project1.code, 50, startDate);
    const activity2 = new Activity(project2.code, 50, startDate);
    const absence = new Absence(100, endDate, Raison.Maladie);
    cra.addActivity(activity);
    cra.addActivity(activity2);
    cra.addAbsence(absence);

    // When
    const emptyDates = cra.getAvailableDatesOfCra();

    // Then
    for (
      let currentDate = startDate;
      currentDate.isBefore(endDate) || currentDate.equals(endDate);
      currentDate = currentDate.plusDays(1)
    ) {
      if (
        cra.isWeekend(currentDate) ||
        cra.checkDateIsHoliday(currentDate) ||
        cra.checkDayIsFull(currentDate)
      ) {
        expect(emptyDates).not.toContainEqual(currentDate);
      } else {
        expect(emptyDates).toContainEqual(currentDate);
      }
    }
  });

  it('un jour férié nest pas considérer comme une date vide', () => {
    // Given
    const date = LocalDate.parse('2023-07-01');
    const cra = createCra(collab, date);

    DateProvider.setTodayDate(date);

    cra.holidays = [new Holiday(LocalDate.parse('2023-07-14'), '14 juillet')];
    const absence = new Absence(50, LocalDate.now(), Raison.Maladie);
    const absence2 = new Absence(50, LocalDate.now(), Raison.Conges);

    //When
    cra.addAbsence(absence);
    cra.addAbsence(absence2);

    // When
    const emptyDates = cra.getAvailableDatesOfCra();

    expect(emptyDates).not.toContainEqual(LocalDate.parse('2023-07-14'));
  });

  it('Should not allow holidays outside of cra month', () => {
    const date = LocalDate.parse('2023-01-01');
    const cra = createCra(collab, date);

    DateProvider.setTodayDate(date);

    expect(
      () =>
        (cra.holidays = [
          new Holiday(LocalDate.parse('2023-07-14'), '14 juillet'),
        ]),
    ).toThrow();
  });

  it('ne permet pas 2 activités du même type pour le même projet et pour la même date', () => {
    const date = LocalDate.parse('2023-09-01');
    const cra = createCra(collab, date);

    const activity = new Activity(
      project1.code,
      50,
      LocalDate.parse('2023-09-05'),
    );
    const activity2 = new Activity(
      project1.code,
      50,
      LocalDate.parse('2023-09-05'),
    );

    cra.addActivity(activity);

    expect(() => {
      cra.addActivity(activity2);
    }).toThrow();
  });

  it('peut etre cloturé', () => {
    // Given
    const date = LocalDate.parse('2023-09-01');
    const cra = createCra(collab, date);
    //When
    cra.status = Status.Closed;
    //Then
    expect(cra.status).toBe(Status.Closed);
  });

  it('cree une regul en cas dajout dune absence apres sa cloture ', () => {
    // Given
    const date = LocalDate.parse('2023-09-01');
    const cra = createCra(collab, date, Status.Closed);
    //When
    const absence = new Absence(100, LocalDate.now(), Raison.Maladie);
    cra.addAbsence(absence);
    //Then
    expect(cra.history).toHaveLength(1);
    expect(cra.history[0].target).toBe(absence);
    expect(cra.history[0].action).toBe(Action.Add);
  });

  it('cree une regul en cas de suppression dune absence apres sa cloture ', () => {
    // Given
    const date = LocalDate.parse('2023-09-01');
    const cra = createCra(collab, date);

    //When
    const absence = new Absence(100, date, Raison.Maladie);
    cra.addAbsence(absence);
    cra.status = Status.Closed;
    cra.deleteAbsence(date, Raison.Maladie);
    //Then
    expect(cra.history).toHaveLength(1);
    expect(cra.history[0].target).toBe(absence);
    expect(cra.history[0].action).toBe(Action.Delete);
  });

  it('cree une regul en cas dajout dune activite apres sa cloture ', () => {
    // Given
    project1.addCollab(collab.email);

    const date = LocalDate.parse('2023-09-30');
    const cra = createCra(collab, date, Status.Closed);
    //When
    const activity = new Activity(
      project1.code,
      100,
      LocalDate.parse('2023-09-30'),
    );
    DateProvider.setTodayDate(date);
    cra.addActivity(activity);
    //Then
    expect(cra.history).toHaveLength(1);
    expect(cra.history[0].target).toBe(activity);
    expect(cra.history[0].action).toBe(Action.Add);
  });

  it('cree une regul en cas de suppression dune activite apres sa cloture ', () => {
    // Given
    const date = LocalDate.parse('2023-09-04');

    project1.addCollab(collab.email);
    const cra = createCra(collab, date);

    DateProvider.setTodayDate(date);
    //When
    const activity = new Activity(project1.code, 100, date);
    cra.addActivity(activity);
    cra.status = Status.Closed;
    cra.deleteActivity(date, project1.code);
    //Then
    expect(cra.history).toHaveLength(1);
    expect(cra.history[0].target).toBe(activity);
    expect(cra.history[0].action).toBe(Action.Delete);
  });

  it("peut retourner le nombre d'activités par projet", () => {
    // Given
    const date = LocalDate.parse('2023-09-01');
    const cra = createCra(collab, date);

    const activity1 = new Activity(
      project1.code,
      50,
      LocalDate.parse('2023-09-01'),
    );
    const activity2 = new Activity(
      project2.code,
      50,
      LocalDate.parse('2023-09-02'),
    );
    const activity3 = new Activity(
      project1.code,
      50,
      LocalDate.parse('2023-09-03'),
    );

    cra.addActivity(activity1);
    cra.addActivity(activity2);
    cra.addActivity(activity3);

    // When
    const projectActivityCountMap = cra.getActivityCountByProject();

    // Then
    expect(projectActivityCountMap.size).toBe(2);
    expect(projectActivityCountMap.get(project1.code)).toBe(2);
    expect(projectActivityCountMap.get(project2.code)).toBe(1);
  });

  it("peut retourner le nombre d'activités pour plusieurs projets", () => {
    // Given
    const date = LocalDate.now();

    const projet1 = new Project(
      new ProjectCode('P001'),
      [],
      '',
      '',
      LocalDate.now(),
      ProjetStatus.Active,
    );
    const projet2 = new Project(
      new ProjectCode('P002'),
      [],
      '',
      '',
      LocalDate.now(),
      ProjetStatus.Active,
    );
    projet1.addCollab(collab.email);
    projet2.addCollab(collab.email);

    const cra = createCra(collab, date);

    const activity1 = new Activity(projet1.code, 50, LocalDate.now());
    const activity2 = new Activity(projet2.code, 50, LocalDate.now());
    cra.addActivity(activity1);
    cra.addActivity(activity2);

    // When
    const projectActivityCountMap = cra.getActivityCountByProject();

    // Then
    expect(projectActivityCountMap.size).toBe(2);
    expect(projectActivityCountMap.get(projet1.code)).toBe(1);
    expect(projectActivityCountMap.get(projet2.code)).toBe(1);
  });

  it('calcul le nombre de jours ouvres du mois', () => {
    // given
    const year = 2023;
    const month = Month.SEPTEMBER;

    const cra = createCra(collab, LocalDate.of(year, month, 1));
    const expectedBusinessDays = 21;
    //when
    const result = cra.calculateBusinessDays(year, month);
    //then
    expect(result).toBe(expectedBusinessDays);
  });

  it('calcul le temps disponible pour une journée', () => {
    const date = LocalDate.parse('2023-09-01');

    const cra = createCra(collab, date);

    DateProvider.setTodayDate(date);

    const result = cra.getAvailableTime(LocalDate.now());

    expect(result).toBe(100);
  });

  it('retourne false si la date et la periode est deja remplie dans le cra', () => {
    const date = LocalDate.parse('2023-09-15');

    const cra = createCra(collab, date);
    cra.addActivity(new Activity(new ProjectCode('P001'), 100, date));

    const result = cra.getAvailableTime(date);

    expect(result).toBe(0);
  });

  it(`n'a pas de temps dispo pendant les holidays`, () => {
    const date = LocalDate.parse('2023-01-01');
    const cra = createCra(collab, date);

    cra.holidays = [new Holiday(date, 'New Years')];

    const availableTime = cra.getAvailableTime(LocalDate.parse('2023-01-01'));
    expect(availableTime).toBe(0);
  });

  it('calcul le nombre de jours vides/non remplis du mois', () => {
    // given
    const date = LocalDate.parse('2023-09-02');

    const cra = createCra(collab, date);

    const projet1 = new Project(
      new ProjectCode('P001'),
      [],
      '',
      '',
      LocalDate.now(),
      ProjetStatus.Active,
    );
    const projet2 = new Project(
      new ProjectCode('P002'),
      [],
      '',
      '',
      LocalDate.now(),
      ProjetStatus.Active,
    );

    DateProvider.setTodayDate(date);

    const expectedEmptyDays = cra.calculateBusinessDays(cra.year, cra.month);
    //then
    expect(cra.calculateEmptyDays()).toBe(expectedEmptyDays);
    //when
    const activity1 = new Activity(
      projet1.code,
      75,
      LocalDate.parse('2023-09-04'),
    );
    const activity2 = new Activity(
      projet2.code,
      25,
      LocalDate.parse('2023-09-04'),
    );
    cra.addActivity(activity1);
    cra.addActivity(activity2);
    //then
    expect(cra.calculateEmptyDays()).toBe(expectedEmptyDays - 1);
  });
});
