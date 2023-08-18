import { Project } from '@app/domain/model/Project';
import { Absence } from '@app/domain/model/Absence';
import { CRA } from '@app/domain/model/CRA';
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

describe('Un CRA ', () => {
  const projet = new Project(
    '123',
    [],
    '',
    '',
    new Date(),
    ProjetStatus.Active,
  );
  it('peut supprimer des absences', () => {
    //given
    const today = new Date();
    const cra = new CRA(
      1,
      3,
      2023,
      new Collab('user', 'test', 'last name', Role.admin),
      new Date(),
      Etat.unsubmitted,
      Status.Open,
    );
    cra.addAbsence(new Absence(cra.id, true, today, Raison.Maladie));

    expect(cra.absences.length).toBe(1);
    //when
    cra.deleteAbsence(today, true);
    //then
    expect(cra.absences.length).toBe(0);
  });

  it('ne peut pas contenir 2 activites ou absences dans le meme creneau', () => {
    //Given
    const date = new Date();
    const collab = new Collab('user', 'test', 'last name', Role.admin);
    const cra = new CRA(
      1,
      date.getMonth(),
      date.getFullYear(),
      collab,
      new Date(),
      Etat.unsubmitted,
      Status.Open,
    );
    projet.addCollab(collab.email);
    const activity = new Activity(projet, true, new Date(), cra.id);
    const absence = new Absence(cra.id, true, date, Raison.Maladie);

    //When
    cra.addActivity(activity);

    //Then
    expect(() => {
      cra.addAbsence(absence);
    }).toThrow(Error('FULL day or period'));
    expect(cra.activities).toHaveLength(1);
  });

  it('ne peut pas contenir plus que 2 activites ou absences par jour', () => {
    //Given
    const date = new Date();
    const collab = new Collab('user', 'test', 'last name', Role.admin);
    const cra = new CRA(
      1,
      date.getMonth(),
      date.getFullYear(),
      collab,
      new Date(),
      Etat.unsubmitted,
      Status.Open,
    );
    projet.addCollab(collab.email);
    const activity = new Activity(projet, true, new Date(), cra.id);
    const activity2 = new Activity(projet, false, new Date(), cra.id);
    const absence = new Absence(cra.id, true, date, Raison.Maladie);

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
    const date = new Date();
    const collab = new Collab('user', 'test', 'last name', Role.admin);
    const cra = new CRA(
      1,
      6,
      date.getFullYear(),
      collab,
      new Date(),
      Etat.unsubmitted,
      Status.Open,
    );

    //When
    const absence = new Absence(
      cra.id,
      true,
      new Date('02-06-2023'),
      Raison.Maladie,
    );

    //Then
    expect(() => {
      cra.addAbsence(absence);
    }).toThrow(ForbiddenException);
  });

  it(' peut ajouter une absence dans le futur', () => {
    //Given
    const collab = new Collab('user', 'test', 'last name', Role.admin);
    const cra = new CRA(
      1,
      6,
      2050,
      collab,
      new Date(),
      Etat.unsubmitted,
      Status.Open,
    );

    //When
    const absence = new Absence(
      cra.id,
      true,
      new Date('02-06-2050'),
      Raison.Maladie,
    );
    cra.addAbsence(absence);

    //Then
    expect(cra.absences).toHaveLength(1);
  });

  it('ne peut pas ajouter une activité dans le futur', () => {
    //Given
    const collab = new Collab('user', 'test', 'last name', Role.admin);
    const cra = new CRA(
      1,
      6,
      2050,
      collab,
      new Date(),
      Etat.unsubmitted,
      Status.Open,
    );

    //When
    const activity = new Activity(projet, true, new Date('02-06-2050'), cra.id);

    //Then
    expect(() => {
      cra.addActivity(activity);
    }).toThrow(ForbiddenException);
  });

  it("ne peut pas supprimer une absence qui n'existe pas", () => {
    //given
    const today = new Date();
    const cra = new CRA(
      1,
      3,
      2023,
      new Collab('user', 'test', 'last name', Role.admin),
      new Date(),
      Etat.unsubmitted,
      Status.Open,
    );
    cra.addAbsence(new Absence(cra.id, true, today, Raison.Maladie));

    expect(cra.absences.length).toBe(1);
    cra.deleteAbsence(today, false);

    expect(cra.absences.length).toBe(1);
  });

  it('peut ajouter/contenir des activites ', () => {
    //Given
    const date = new Date();
    const collab = new Collab('user', 'test', 'last name', Role.admin);
    const cra = new CRA(
      1,
      date.getMonth(),
      date.getFullYear(),
      collab,
      new Date(),
      Etat.unsubmitted,
      Status.Open,
    );
    projet.addCollab(collab.email);
    const activity = new Activity(projet, true, new Date(), cra.id);

    //When
    cra.addActivity(activity);

    //Then
    expect(cra.activities).toHaveLength(1);
  });
  it('peut ajouter/contenir des absences ', () => {
    //Given
    const date = new Date();
    const collab = new Collab('user', 'test', 'last name', Role.admin);
    const cra = new CRA(
      1,
      date.getMonth(),
      date.getFullYear(),
      collab,
      new Date(),
      Etat.unsubmitted,
      Status.Open,
    );
    const absence = new Absence(cra.id, true, new Date(), Raison.Maladie);

    //When
    cra.addAbsence(absence);

    //Then
    expect(cra.absences).toHaveLength(1);
  });

  it('ne peut pas etre soumis si il contient des jours vides ', () => {
    //Given
    const date = new Date();
    const collab = new Collab('user', 'test', 'last name', Role.admin);
    const cra = new CRA(
      1,
      date.getMonth(),
      date.getFullYear(),
      collab,
      new Date(),
      Etat.unsubmitted,
      Status.Open,
    );
    const absence = new Absence(cra.id, true, new Date(), Raison.Maladie);
    const absence2 = new Absence(cra.id, false, new Date(), Raison.Maladie);

    //When
    cra.addAbsence(absence);
    cra.addAbsence(absence2);

    //Then
    expect(cra.SubmitCra()).toBe(false);
    expect(cra.etat).toBe(Etat.unsubmitted);
  });

  it('peut être soumis si tous les jours sont remplis', () => {
    // Given

    const date = new Date();
    const collab = new Collab('user', 'test', 'last name', Role.admin);
    projet.addCollab(collab.email);
    const cra = new CRA(
      1,
      date.getMonth() + 1,
      date.getFullYear(),
      collab,
      new Date(),
      Etat.unsubmitted,
      Status.Open,
    );
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    // Fill all days with activities
    let i = 1;
    for (
      let currentDate = startDate;
      currentDate <= endDate;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      if (!cra.isWeekend(new Date(currentDate))) {
        const abs = new Absence(
          cra.id,
          true,
          new Date(currentDate),
          Raison.Maladie,
        );
        const act = new Activity(projet, false, new Date(currentDate), cra.id);
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
    const date = new Date();
    const collab = new Collab('user', 'test', 'last name', Role.admin);
    projet.addCollab(collab.email);
    const cra = new CRA(
      1,
      date.getMonth() + 1,
      date.getFullYear(),
      collab,
      new Date(),
      Etat.unsubmitted,
      Status.Open,
    );
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const activity = new Activity(projet, false, new Date(startDate), cra.id);
    const activity2 = new Activity(projet, true, new Date(startDate), cra.id);
    const absence = new Absence(
      cra.id,
      true,
      new Date(endDate),
      Raison.Maladie,
    );
    cra.addActivity(activity);
    cra.addActivity(activity2);
    cra.addAbsence(absence);

    // When
    const emptyDates = cra.getAvailableDatesOfCra();

    // Then
    for (
      let currentDate = startDate;
      currentDate <= endDate;
      currentDate.setDate(currentDate.getDate() + 1)
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
    const date = new Date();
    const collab = new Collab('user', 'test', 'last name', Role.admin);
    const cra = new CRA(
      1,
      date.getMonth() + 1,
      date.getFullYear(),
      collab,
      new Date(),
      Etat.unsubmitted,
      Status.Open,
    );
    cra.holidays = [new Holiday(1, new Date('2023-07-14'), '14 juillet')];
    const absence = new Absence(cra.id, true, new Date(), Raison.Maladie);
    const absence2 = new Absence(cra.id, false, new Date(), Raison.Maladie);

    //When
    cra.addAbsence(absence);
    cra.addAbsence(absence2);

    // When
    const emptyDates = cra.getAvailableDatesOfCra();

    expect(emptyDates).not.toContainEqual(new Date('2023-07-14'));
  });

  it('peut etre cloturé', () => {
    // Given
    const date = new Date();
    const collab = new Collab('user', 'test', 'last name', Role.admin);
    const cra = new CRA(
      1,
      date.getMonth() + 1,
      date.getFullYear(),
      collab,
      new Date(),
      Etat.unsubmitted,
      Status.Open,
    );
    //When
    cra.status = Status.Closed;
    //Then
    expect(cra.status).toBe(Status.Closed);
  });

  it('cree une regul en cas dajout dune absence apres sa cloture ', () => {
    // Given
    const date = new Date();
    const collab = new Collab('user', 'test', 'last name', Role.admin);
    const cra = new CRA(
      1,
      date.getMonth() + 1,
      date.getFullYear(),
      collab,
      new Date(),
      Etat.unsubmitted,
      Status.Closed,
    );
    //When
    const absence = new Absence(cra.id, true, new Date(), Raison.Maladie);
    cra.addAbsence(absence);
    //Then
    expect(cra.history).toHaveLength(1);
    expect(cra.history[0].target).toBe(absence);
    expect(cra.history[0].action).toBe(Action.Add);
  });
  it('cree une regul en cas de suppression dune absence apres sa cloture ', () => {
    // Given
    const date = new Date();
    const collab = new Collab('user', 'test', 'last name', Role.admin);
    const cra = new CRA(
      1,
      date.getMonth() + 1,
      date.getFullYear(),
      collab,
      new Date(),
      Etat.unsubmitted,
      Status.Open,
    );
    //When
    const absence = new Absence(cra.id, true, date, Raison.Maladie);
    cra.addAbsence(absence);
    cra.status = Status.Closed;
    cra.deleteAbsence(date, true);
    //Then
    expect(cra.history).toHaveLength(1);
    expect(cra.history[0].target).toBe(absence);
    expect(cra.history[0].action).toBe(Action.Delete);
  });

  it('cree une regul en cas dajout dune activite apres sa cloture ', () => {
    // Given
    const date = new Date();
    const collab = new Collab('user', 'test', 'last name', Role.admin);
    projet.addCollab(collab.email);
    const cra = new CRA(
      1,
      date.getMonth() + 1,
      date.getFullYear(),
      collab,
      new Date(),
      Etat.unsubmitted,
      Status.Closed,
    );
    //When
    const activity = new Activity(projet, true, new Date(), cra.id);
    cra.addActivity(activity);
    //Then
    expect(cra.history).toHaveLength(1);
    expect(cra.history[0].target).toBe(activity);
    expect(cra.history[0].action).toBe(Action.Add);
  });
  it('cree une regul en cas de suppression dune activite apres sa cloture ', () => {
    // Given
    const date = new Date();
    const collab = new Collab('user', 'test', 'last name', Role.admin);
    projet.addCollab(collab.email);
    const cra = new CRA(
      1,
      date.getMonth() + 1,
      date.getFullYear(),
      collab,
      new Date(),
      Etat.unsubmitted,
      Status.Open,
    );
    //When
    const activity = new Activity(projet, true, date, cra.id);
    cra.addActivity(activity);
    cra.status = Status.Closed;
    cra.deleteActivity(date, true);
    //Then
    expect(cra.history).toHaveLength(1);
    expect(cra.history[0].target).toBe(activity);
    expect(cra.history[0].action).toBe(Action.Delete);
  });
  it("peut retourner le nombre d'activités par projet", () => {
    // Given
    const date = new Date();
    const collab = new Collab('user', 'test', 'last name', Role.admin);
    projet.addCollab(collab.email);
    const cra = new CRA(
      1,
      date.getMonth(),
      date.getFullYear(),
      collab,
      new Date(),
      Etat.unsubmitted,
      Status.Open,
    );
    const tomorrow = new Date(+1);

    const activity1 = new Activity(projet, true, new Date(), cra.id);
    const activity2 = new Activity(projet, false, new Date(), cra.id);
    cra.addActivity(activity1);
    cra.addActivity(activity2);

    // When
    const projectActivityCountMap = cra.getActivityCountByProject();

    // Then
    expect(projectActivityCountMap.size).toBe(1);
    expect(projectActivityCountMap.get(projet.code)).toBe(2);
  });

  it("peut retourner le nombre d'activités pour plusieurs projets", () => {
    // Given
    const date = new Date();
    const collab = new Collab('user', 'test', 'last name', Role.admin);
    const projet1 = new Project(
      'P001',
      [],
      '',
      '',
      new Date(),
      ProjetStatus.Active,
    );
    const projet2 = new Project(
      'P002',
      [],
      '',
      '',
      new Date(),
      ProjetStatus.Active,
    );
    projet1.addCollab(collab.email);
    projet2.addCollab(collab.email);

    const cra = new CRA(
      1,
      date.getMonth(),
      date.getFullYear(),
      collab,
      new Date(),
      Etat.unsubmitted,
      Status.Open,
    );

    const activity1 = new Activity(projet1, true, new Date(), cra.id);
    const activity2 = new Activity(projet2, false, new Date(), cra.id);
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
    const month = 8;
    const collab = new Collab('user', 'test', 'last name', Role.admin);
    const cra = new CRA(
      1,
      month,
      year,
      collab,
      new Date(),
      Etat.unsubmitted,
      Status.Open,
    );
    const expectedBusinessDays = 23;
    //when
    const result = cra.calculateBusinessDays(year, month);
    //then
    expect(result).toBe(expectedBusinessDays);
  });

  it('retourne true si la date ou periode ne figure pas deja dans le cra', () => {
    const periode = true;
    const collab = new Collab('user', 'test', 'last name', Role.admin);
    const cra = new CRA(
      1,
      8,
      2023,
      collab,
      new Date(),
      Etat.unsubmitted,
      Status.Open,
    );
    cra.activities = [];
    cra.absences = [];

    const result = cra.verifyDateNotInCRA(new Date(), periode);

    expect(result).toBe(true);
  });

  it('retourne false si la date et la periode est deja remplie dans le cra', () => {
    const periode = true;
    const collab = new Collab('user', 'test', 'last name', Role.admin);
    const cra = new CRA(
      1,
      8,
      2023,
      collab,
      new Date(),
      Etat.unsubmitted,
      Status.Open,
    );
    const projet = new Project(
      'P001',
      [],
      '',
      '',
      new Date(),
      ProjetStatus.Active,
    );
    cra.activities = [new Activity(projet, periode, new Date(), cra.id)];
    cra.absences = [];

    const result = cra.verifyDateNotInCRA(new Date(), periode);

    expect(result).toBe(false);
  });

  it('calcul le nombre de jours vides/non remplis du mois', () => {
    // given
    const date = new Date();
    const collab = new Collab('user', 'test', 'last name', Role.admin);
    const cra = new CRA(
      1,
      date.getMonth() + 1,
      date.getFullYear(),
      collab,
      new Date(),
      Etat.unsubmitted,
      Status.Open,
    );
    const projet = new Project(
      'P001',
      [],
      '',
      '',
      new Date(),
      ProjetStatus.Active,
    );
    const expectedEmptyDays = cra.calculateBusinessDays(cra.year, cra.month);
    //then
    expect(cra.calculateEmptyDays()).toBe(expectedEmptyDays);
    //when
    const activity1 = new Activity(projet, true, new Date(), cra.id);
    const activity2 = new Activity(projet, false, new Date(), cra.id);
    cra.addActivity(activity1);
    cra.addActivity(activity2);
    //then
    expect(cra.calculateEmptyDays()).toBe(expectedEmptyDays - 1);
  });
});
