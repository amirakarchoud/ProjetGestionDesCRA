import { Absence } from '@app/domain/model/Absence';
import { Activity } from '@app/domain/model/Activity';
import { CRA } from '@app/domain/model/CRA';
import { Collab } from '@app/domain/model/Collab';
import { Project } from '@app/domain/model/Project';
import { Raison } from '@app/domain/model/Raison';
import { Role } from '@app/domain/model/Role';
import { Etat } from '@app/domain/model/etat.enum';
import { Status } from '@app/domain/model/Status';
import { ProjetStatus } from '@app/domain/model/projetStatus.enum';

describe('Collaborateur ', () => {
  //Given
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
    '123',
    [],
    '',
    '',
    new Date(),
    ProjetStatus.Active,
  );
  beforeAll(() => {
    projet.addCollab(collab.email);
  });

  it('peut ajouter une activite pour le mois courant ', () => {
    const activity = new Activity(projet, true, date, cra.id);

    expect(activity.date).toBe(date);
  });

  it('peut avoir le role admin ', () => {
    collab.role = Role.admin;

    expect(collab.role).toBe(Role.admin);
  });

  it('peut avoir le role user ', () => {
    collab.role = Role.user;

    expect(collab.role).toBe(Role.user);
  });
});
