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
import { ProjectCode } from '@app/domain/model/project.code';
import { CollabEmail } from '@app/domain/model/collab.email';

function createCra(projet: Project, collab: Collab, date: Date) {
  projet.addCollab(collab.email);
  const cra = new CRA(
    date.getMonth(),
    date.getFullYear(),
    collab.email,
    Etat.unsubmitted,
    Status.Open,
  );

  cra['today'] = () => {
    return date;
  };
  return cra;
}

describe('Un CRA ', () => {
  const projet = new Project(
    new ProjectCode('123'),
    [],
    '',
    '',
    new Date(),
    ProjetStatus.Active,
  );
  const projet2 = new Project(
    new ProjectCode('321'),
    [],
    '',
    '',
    new Date(),
    ProjetStatus.Active,
  );
  const collab = new Collab(
    new CollabEmail('user@proxym.fr'),
    'test',
    'last name',
    Role.admin,
  );

  it('peut supprimer des absences', () => {
    //given
    const today = new Date();
    const cra = new CRA(3, 2023, collab.email, Etat.unsubmitted, Status.Open);
    cra.addAbsence(new Absence(cra.id, 50, today, Raison.Maladie));

    expect(cra.absences.length).toBe(1);
    //when
    cra.deleteAbsence(today, Raison.Maladie);
    //then
    expect(cra.absences.length).toBe(0);
  });

  it('ne peut pas contenir 2 activites ou absences dans le meme creneau', () => {
    //Given
    const date = new Date();
    const cra = new CRA(
      date.getMonth(),
      date.getFullYear(),
      collab.email,
      Etat.unsubmitted,
      Status.Open,
    );
    projet.addCollab(collab.email);
    const activity = new Activity(projet.code, 50, new Date(), cra.id);
    const absence = new Absence(cra.id, 75, date, Raison.Maladie);

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
    const cra = new CRA(
      date.getMonth(),
      date.getFullYear(),
      collab.email,
      Etat.unsubmitted,
      Status.Open,
    );
    projet.addCollab(collab.email);
    const activity = new Activity(projet.code, 50, new Date(), cra.id);
    const activity2 = new Activity(projet.code, 25, new Date(), cra.id);
    const absence = new Absence(cra.id, 50, date, Raison.Maladie);

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
    const cra = new CRA(
      6,
      date.getFullYear(),
      collab.email,
      Etat.unsubmitted,
      Status.Open,
    );

    //When
    const absence = new Absence(
      cra.id,
      50,
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
    const cra = new CRA(6, 2050, collab.email, Etat.unsubmitted, Status.Open);

    //When
    const absence = new Absence(
      cra.id,
      100,
      new Date('02-06-2050'),
      Raison.Maladie,
    );
    cra.addAbsence(absence);

    //Then
    expect(cra.absences).toHaveLength(1);
  });

  it('ne peut pas ajouter une activité dans le futur', () => {
    //Given
    const cra = new CRA(6, 2050, collab.email, Etat.unsubmitted, Status.Open);

    //When
    const activity = new Activity(
      projet.code,
      50,
      new Date('02-06-2050'),
      cra.id,
    );

    //Then
    expect(() => {
      cra.addActivity(activity);
    }).toThrow(ForbiddenException);
  });

  it("ne peut pas supprimer une absence qui n'existe pas", () => {
    //given
    const today = new Date();
    const cra = new CRA(3, 2023, collab.email, Etat.unsubmitted, Status.Open);
    cra.addAbsence(new Absence(cra.id, 50, today, Raison.Maladie));

    expect(cra.absences.length).toBe(1);
    cra.deleteAbsence(today, Raison.Conges);

    expect(cra.absences.length).toBe(1);
  });

  it('peut ajouter/contenir des activites ', () => {
    //Given
    const date = new Date();

    const cra = new CRA(
      date.getMonth(),
      date.getFullYear(),
      collab.email,
      Etat.unsubmitted,
      Status.Open,
    );
    projet.addCollab(collab.email);
    const activity = new Activity(projet.code, 50, new Date(), cra.id);

    //When
    cra.addActivity(activity);

    //Then
    expect(cra.activities).toHaveLength(1);
  });

  it('peut ajouter/contenir des absences ', () => {
    //Given
    const date = new Date();

    const cra = new CRA(
      date.getMonth(),
      date.getFullYear(),
      collab.email,
      Etat.unsubmitted,
      Status.Open,
    );
    const absence = new Absence(cra.id, 50, new Date(), Raison.Maladie);

    //When
    cra.addAbsence(absence);

    //Then
    expect(cra.absences).toHaveLength(1);
  });

  it('ne peut pas etre soumis si il contient des jours vides ', () => {
    //Given
    const date = new Date();

    const cra = new CRA(
      date.getMonth(),
      date.getFullYear(),
      collab.email,
      Etat.unsubmitted,
      Status.Open,
    );
    const absence = new Absence(cra.id, 50, new Date(), Raison.Maladie);
    const absence2 = new Absence(cra.id, 50, new Date(), Raison.Maladie);

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

    projet.addCollab(collab.email);
    const cra = new CRA(
      date.getMonth() + 1,
      date.getFullYear(),
      collab.email,
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
          50,
          new Date(currentDate),
          Raison.Maladie,
        );
        const act = new Activity(
          projet.code,
          50,
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
    expect(cra.etat).toBe(Etat.submitted);
  });

  it('peut retourner les dates vides', () => {
    // Given
    const date = new Date();

    projet.addCollab(collab.email);
    const cra = new CRA(
      date.getMonth() + 1,
      date.getFullYear(),
      collab.email,
      Etat.unsubmitted,
      Status.Open,
    );
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const activity = new Activity(projet.code, 50, new Date(startDate), cra.id);
    const activity2 = new Activity(
      projet2.code,
      50,
      new Date(startDate),
      cra.id,
    );
    const absence = new Absence(cra.id, 100, new Date(endDate), Raison.Maladie);
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
    const cra = new CRA(
      date.getMonth() + 1,
      date.getFullYear(),
      collab.email,
      Etat.unsubmitted,
      Status.Open,
    );
    cra.holidays = [new Holiday(new Date('2023-07-14'), '14 juillet')];
    const absence = new Absence(cra.id, 50, new Date(), Raison.Maladie);
    const absence2 = new Absence(cra.id, 50, new Date(), Raison.Conges);

    //When
    cra.addAbsence(absence);
    cra.addAbsence(absence2);

    // When
    const emptyDates = cra.getAvailableDatesOfCra();

    expect(emptyDates).not.toContainEqual(new Date('2023-07-14'));
  });

  it('ne permet pas 2 activités du même type pour le même projet et pour la même date', () => {
    const date = new Date('2023-09-01');
    const cra = createCra(projet, collab, date);

    const activity = new Activity(
      projet.code,
      50,
      new Date('2023-09-05'),
      cra.id,
    );
    cra.addActivity(activity);
    const activity2 = new Activity(
      projet.code,
      50,
      new Date('2023-09-05'),
      cra.id,
    );

    cra.addActivity(activity);

    expect(() => {
      cra.addActivity(activity2);
    }).toThrow();
  });

  it('peut etre cloturé', () => {
    // Given
    const date = new Date();
    const cra = new CRA(
      date.getMonth() + 1,
      date.getFullYear(),
      collab.email,
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
    const cra = new CRA(
      date.getMonth() + 1,
      date.getFullYear(),
      collab.email,
      Etat.unsubmitted,
      Status.Closed,
    );
    //When
    const absence = new Absence(cra.id, 100, new Date(), Raison.Maladie);
    cra.addAbsence(absence);
    //Then
    expect(cra.history).toHaveLength(1);
    expect(cra.history[0].target).toBe(absence);
    expect(cra.history[0].action).toBe(Action.Add);
  });

  it('cree une regul en cas de suppression dune absence apres sa cloture ', () => {
    // Given
    const date = new Date();
    const cra = new CRA(
      date.getMonth() + 1,
      date.getFullYear(),
      collab.email,
      Etat.unsubmitted,
      Status.Open,
    );

    //When
    const absence = new Absence(cra.id, 100, date, Raison.Maladie);
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
    const date = new Date();

    projet.addCollab(collab.email);
    const cra = new CRA(
      date.getMonth() + 1,
      date.getFullYear(),
      collab.email,
      Etat.unsubmitted,
      Status.Closed,
    );
    //When
    const activity = new Activity(projet.code, 100, new Date(), cra.id);
    cra.addActivity(activity);
    //Then
    expect(cra.history).toHaveLength(1);
    expect(cra.history[0].target).toBe(activity);
    expect(cra.history[0].action).toBe(Action.Add);
  });

  it('cree une regul en cas de suppression dune activite apres sa cloture ', () => {
    // Given
    const date = new Date('2023/09/01');

    projet.addCollab(collab.email);
    const cra = new CRA(
      date.getMonth() + 1,
      date.getFullYear(),
      collab.email,
      Etat.unsubmitted,
      Status.Open,
    );

    cra['today'] = () => {
      return date;
    };
    //When
    const activity = new Activity(projet.code, 100, date, cra.id);
    cra.addActivity(activity);
    cra.status = Status.Closed;
    cra.deleteActivity(date, projet.code);
    //Then
    expect(cra.history).toHaveLength(1);
    expect(cra.history[0].target).toBe(activity);
    expect(cra.history[0].action).toBe(Action.Delete);
  });

  it("peut retourner le nombre d'activités par projet", () => {
    // Given
    const date = new Date('2023/09/01');
    const cra = createCra(projet, collab, date);

    const activity1 = new Activity(
      projet.code,
      50,
      new Date('2023-09-01'),
      cra.id,
    );
    const activity2 = new Activity(
      projet2.code,
      50,
      new Date('2023-09-02'),
      cra.id,
    );
    const activity3 = new Activity(
      projet.code,
      50,
      new Date('2023-09-03'),
      cra.id,
    );

    cra.addActivity(activity1);
    cra.addActivity(activity2);
    cra.addActivity(activity3);

    // When
    const projectActivityCountMap = cra.getActivityCountByProject();

    // Then
    expect(projectActivityCountMap.size).toBe(2);
    expect(projectActivityCountMap.get(projet.code)).toBe(2);
    expect(projectActivityCountMap.get(projet2.code)).toBe(1);
  });

  it("peut retourner le nombre d'activités pour plusieurs projets", () => {
    // Given
    const date = new Date();

    const projet1 = new Project(
      new ProjectCode('P001'),
      [],
      '',
      '',
      new Date(),
      ProjetStatus.Active,
    );
    const projet2 = new Project(
      new ProjectCode('P002'),
      [],
      '',
      '',
      new Date(),
      ProjetStatus.Active,
    );
    projet1.addCollab(collab.email);
    projet2.addCollab(collab.email);

    const cra = createCra(projet, collab, date);

    const activity1 = new Activity(projet1.code, 50, new Date(), cra.id);
    const activity2 = new Activity(projet2.code, 50, new Date(), cra.id);
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

    const cra = new CRA(
      month,
      year,
      collab.email,
      Etat.unsubmitted,
      Status.Open,
    );
    const expectedBusinessDays = 23;
    //when
    const result = cra.calculateBusinessDays(year, month);
    //then
    expect(result).toBe(expectedBusinessDays);
  });

  it('calcul le temps disponible pour une journée', () => {
    const date = new Date('2023-09-01');

    const cra = createCra(projet, collab, date);

    cra['today'] = () => {
      return date;
    };

    cra.activities = [];
    cra.absences = [];

    const result = cra.getAvailableTime(new Date());

    expect(result).toBe(100);
  });

  it('retourne false si la date et la periode est deja remplie dans le cra', () => {
    const cra = new CRA(8, 2023, collab.email, Etat.unsubmitted, Status.Open);
    const projet = new Project(
      new ProjectCode('P001'),
      [],
      '',
      '',
      new Date(),
      ProjetStatus.Active,
    );
    cra.activities = [new Activity(projet.code, 100, new Date(), cra.id)];
    cra.absences = [];

    const result = cra.getAvailableTime(new Date());

    expect(result).toBe(0);
  });

  it('calcul le nombre de jours vides/non remplis du mois', () => {
    // given
    const date = new Date();

    const cra = new CRA(
      date.getMonth() + 1,
      date.getFullYear(),
      collab.email,
      Etat.unsubmitted,
      Status.Open,
    );
    const projet1 = new Project(
      new ProjectCode('P001'),
      [],
      '',
      '',
      new Date(),
      ProjetStatus.Active,
    );
    const projet2 = new Project(
      new ProjectCode('P002'),
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
    const activity1 = new Activity(projet1.code, 75, new Date(), cra.id);
    const activity2 = new Activity(projet2.code, 25, new Date(), cra.id);
    cra.addActivity(activity1);
    cra.addActivity(activity2);
    //then
    expect(cra.calculateEmptyDays()).toBe(expectedEmptyDays - 1);
  });
});
