import { Absence } from '@app/domain/model/Absence';
import { Collab } from '@app/domain/model/Collab';
import { Raison } from '@app/domain/model/Raison';
import { Role } from '@app/domain/model/Role';
import { CollabEmail } from '@app/domain/model/collab.email';
import { createCra } from './utils';
import { LocalDate } from '@js-joda/core';

describe('Une absence ', () => {
  const collab = new Collab(
    new CollabEmail('user@proxym.fr'),
    'test',
    'last name',
    Role.admin,
  );

  it('ne peut pas avoir des attributs null', () => {
    //When
    expect(
      () => new Absence(null, LocalDate.now(), Raison.Maladie),
    ).toThrowError('cannot have a null attribut');

    expect(() => new Absence(100, null, Raison.Maladie)).toThrowError(
      'cannot have a null attribut',
    );

    expect(() => new Absence(100, LocalDate.now(), null)).toThrowError(
      'cannot have a null attribut',
    );
  });
  it('peut etre cree par un collab', () => {
    //given
    const date = LocalDate.now();
    const cra = createCra(collab, date);
    //When
    const absence = new Absence(100, date, Raison.Maladie);
    cra.addActivity(absence);

    //Then
    expect(absence).toBeDefined();
    expect(absence.date).toBe(date);
    expect(cra.absences).toContain(absence);
  });

  it('peut avoir un raison', () => {
    //When
    const absence = new Absence(100, LocalDate.now(), Raison.Maladie);
    //Then
    expect(absence.raison).toBe(Raison.Maladie);
  });

  it('est associee a une date', () => {
    //given
    const date = LocalDate.now();
    //When
    const absence = new Absence(100, date, Raison.Maladie);
    //Then
    expect(absence.date).toBe(date);
  });
});
