import { Absence } from '@app/domain/model/Absence';
import { CRA } from '@app/domain/model/CRA';
import { Collab } from '@app/domain/model/Collab';
import { Raison } from '@app/domain/model/Raison';
import { Role } from '@app/domain/model/Role';
import { Etat } from '@app/domain/model/etat.enum';
import { Status } from '@app/domain/model/Status';
import { CollabEmail } from '@app/domain/model/collab.email';

describe('Une absence ', () => {
  const collab = new Collab(
    new CollabEmail('user@proxym.fr'),
    'test',
    'last name',
    Role.admin,
  );

  it('ne peut pas avoir des attributs null', () => {
    //given
    const date = new Date();
    const cra = new CRA(
      date.getMonth() + 1,
      date.getFullYear(),
      collab.email,
      Etat.unsubmitted,
      Status.Open,
    );
    //When
    expect(
      () => new Absence(null, 100, new Date(), Raison.Maladie),
    ).toThrowError('cannot have a null attribut');

    expect(
      () => new Absence(cra.id, null, new Date(), Raison.Maladie),
    ).toThrowError('cannot have a null attribut');

    expect(() => new Absence(cra.id, 100, null, Raison.Maladie)).toThrowError(
      'cannot have a null attribut',
    );

    expect(() => new Absence(cra.id, 100, new Date(), null)).toThrowError(
      'cannot have a null attribut',
    );
  });
  it('peut etre cree par un collab', () => {
    //given
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

    //Then
    expect(absence).toBeDefined();
    expect(absence.cra).toBe(cra.id);
    expect(absence.date).toBe(date);
  });

  it('peut avoir un raison', () => {
    //given
    const date = new Date();
    const cra = new CRA(
      date.getMonth() + 1,
      date.getFullYear(),
      collab.email,
      Etat.unsubmitted,
      Status.Open,
    );
    //When
    const absence = new Absence(cra.id, 100, new Date(), Raison.Maladie);

    //Then
    expect(absence.raison).toBe(Raison.Maladie);
  });

  it('est associee a une date', () => {
    //given
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

    //Then
    expect(absence.date).toBe(date);
  });
});
