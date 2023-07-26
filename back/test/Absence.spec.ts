import { Absence } from '@app/domain/model/Absence';
import { CRA } from '@app/domain/model/CRA';
import { Collab } from '@app/domain/model/Collab';
import { Raison } from '@app/domain/model/Raison';
import { Role } from '@app/domain/model/Role';
import { Etat } from '@app/domain/model/etat.enum';

describe('Une absence ', () => {
  it('peut etre cree par un collab', () => {
    //given
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
    //When
    const absence = new Absence(1, cra.id, true, new Date(), Raison.Maladie);

    //Then
    expect(absence).toBeDefined();
  });

  it('peut avoir un raison', () => {
    //given
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
    //When
    const absence = new Absence(1, cra.id, true, new Date(), Raison.Maladie);

    //Then
    expect(absence.raison).toBe(Raison.Maladie);
  });

  it('est associee a une date', () => {
    //given
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
    //When
    const absence = new Absence(1, cra.id, true, date, Raison.Maladie);

    //Then
    expect(absence.date).toBe(date);
  });
});
