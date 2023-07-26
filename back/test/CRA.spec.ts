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

describe('Un CRA ', () => {
  it('peut supprimer des absences', () => {
    //given
    const today = new Date();
    const cra = new CRA(
      1,
      3,
      2023,
      new Collab('user', 'test', Role.admin),
      new Date(),
      Etat.unsubmitted,
    );
    cra.addAbsence(new Absence(1, cra.id, true, today, Raison.Maladie));

    expect(cra.absences.length).toBe(1);
    //when
    cra.deleteAbsence(today, true);
    //then
    expect(cra.absences.length).toBe(0);
  });

  it('ne peut pas contenir 2 activites ou absences dans le meme creneau', () => {
    //Given
    const date = new Date();
    const collab = new Collab('user', 'test', Role.admin);
    const cra = new CRA(
      1,
      date.getMonth(),
      date.getFullYear(),
      collab,
      new Date(),
      Etat.unsubmitted,
    );
    const projet = new Project('123', []);
    projet.addCollab(collab.email);
    const activity = new Activity(1, collab, projet, true, new Date(), cra.id);
    const absence = new Absence(2, cra.id, true, date, Raison.Maladie);

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
    const collab = new Collab('user', 'test', Role.admin);
    const cra = new CRA(
      1,
      date.getMonth(),
      date.getFullYear(),
      collab,
      new Date(),
      Etat.unsubmitted,
    );
    const projet = new Project('123', []);
    projet.addCollab(collab.email);
    const activity = new Activity(1, collab, projet, true, new Date(), cra.id);
    const activity2 = new Activity(
      2,
      collab,
      projet,
      false,
      new Date(),
      cra.id,
    );
    const absence = new Absence(3, cra.id, true, date, Raison.Maladie);

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
    const collab = new Collab('user', 'test', Role.admin);
    const cra = new CRA(
      1,
      6,
      date.getFullYear(),
      collab,
      new Date(),
      Etat.unsubmitted,
    );

    //When
    const absence = new Absence(
      1,
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

  it("ne peut pas supprimer une absence qui n'existe pas", () => {
    //given
    const today = new Date();
    const cra = new CRA(
      1,
      3,
      2023,
      new Collab('user', 'test', Role.admin),
      new Date(),
      Etat.unsubmitted,
    );
    cra.addAbsence(new Absence(1, cra.id, true, today, Raison.Maladie));

    expect(cra.absences.length).toBe(1);
    cra.deleteAbsence(today, false);

    expect(cra.absences.length).toBe(1);
  });

  it('peut ajouter/contenir des activites ', () => {
    //Given
    const date = new Date();
    const collab = new Collab('user', 'test', Role.admin);
    const cra = new CRA(
      1,
      date.getMonth(),
      date.getFullYear(),
      collab,
      new Date(),
      Etat.unsubmitted,
    );
    const projet = new Project('123', []);
    projet.addCollab(collab.email);
    const activity = new Activity(1, collab, projet, true, new Date(), cra.id);

    //When
    cra.addActivity(activity);

    //Then
    expect(cra.activities).toHaveLength(1);
  });
  it('peut ajouter/contenir des absences ', () => {
    //Given
    const date = new Date();
    const collab = new Collab('user', 'test', Role.admin);
    const cra = new CRA(
      1,
      date.getMonth(),
      date.getFullYear(),
      collab,
      new Date(),
      Etat.unsubmitted,
    );
    const absence = new Absence(1, cra.id, true, new Date(), Raison.Maladie);

    //When
    cra.addAbsence(absence);

    //Then
    expect(cra.absences).toHaveLength(1);
  });

  it('ne peut pas etre soumis si il contient des jours vides ', () => {
    //Given
    const date = new Date();
    const collab = new Collab('user', 'test', Role.admin);
    const cra = new CRA(
      1,
      date.getMonth(),
      date.getFullYear(),
      collab,
      new Date(),
      Etat.unsubmitted,
    );
    const absence = new Absence(1, cra.id, true, new Date(), Raison.Maladie);
    const absence2 = new Absence(2, cra.id, false, new Date(), Raison.Maladie);

    //When
    cra.addAbsence(absence);
    cra.addAbsence(absence2);

    //Then
    expect(cra.SubmitCra()).toBe(false);
  });

  it('peut être soumis si tous les jours sont remplis', () => {
    // Given
    const projet = new Project('123', []);

    const date = new Date();
    const collab = new Collab('user', 'test', Role.admin);
    projet.addCollab(collab.email);
    const cra = new CRA(
      1,
      date.getMonth() + 1,
      date.getFullYear(),
      collab,
      new Date(),
      Etat.unsubmitted,
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
          i,
          cra.id,
          true,
          new Date(currentDate),
          Raison.Maladie,
        );
        const act = new Activity(
          i + 1,
          collab,
          projet,
          false,
          new Date(currentDate),
          cra.id,
        );
        cra.addAbsence(abs);
        cra.addActivity(act);
        i = i + 2;
      }
    }

    // When
    const result = cra.SubmitCra();

    // Then
    expect(result).toBe(true);
  });

  it('peut retourner les dates vides', () => {
    // Given
    const projet = new Project('123', []);
    const date = new Date();
    const collab = new Collab('user', 'test', Role.admin);
    projet.addCollab(collab.email);
    const cra = new CRA(
      1,
      date.getMonth() + 1,
      date.getFullYear(),
      collab,
      new Date(),
      Etat.unsubmitted,
    );
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const activity = new Activity(
      1,
      collab,
      projet,
      false,
      new Date(startDate),
      cra.id,
    );
    const activity2 = new Activity(
      2,
      collab,
      projet,
      true,
      new Date(startDate),
      cra.id,
    );
    const absence = new Absence(
      3,
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
    const collab = new Collab('user', 'test', Role.admin);
    const cra = new CRA(
      1,
      date.getMonth() + 1,
      date.getFullYear(),
      collab,
      new Date(),
      Etat.unsubmitted,
    );
    cra.holidays = [new Holiday(1, new Date('2023-07-14'), '14 juillet')];
    const absence = new Absence(1, cra.id, true, new Date(), Raison.Maladie);
    const absence2 = new Absence(2, cra.id, false, new Date(), Raison.Maladie);

    //When
    cra.addAbsence(absence);
    cra.addAbsence(absence2);

    // When
    const emptyDates = cra.getAvailableDatesOfCra();

    expect(emptyDates).not.toContainEqual(new Date('2023-07-14'));
  });
});
