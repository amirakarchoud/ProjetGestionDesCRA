import { Activity } from '@app/domain/model/Activity';
import { CRA } from '@app/domain/model/CRA';
import { Collab } from '@app/domain/model/Collab';
import { Project } from '@app/domain/model/Project';
import { Role } from '@app/domain/model/Role';
import { Etat } from '@app/domain/model/etat.enum';

describe('Une activite ', () => {
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

    const projet = new Project('123', []);
    projet.addCollab(collab.email);
    //When
    const activity = new Activity(1, collab, projet, true, new Date(), cra.id);

    //Then
    expect(activity).toBeDefined();
  });

  it('est associee a un projet', () => {
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

    const projet = new Project('123', []);
    projet.addCollab(collab.email);
    const activity = new Activity(1, collab, projet, true, new Date(), cra.id);

    //Then
    expect(activity.project).toBe(projet);
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

    const projet = new Project('123', []);
    projet.addCollab(collab.email);
    const activity = new Activity(1, collab, projet, true, date, cra.id);

    //Then
    expect(activity.date).toBe(date);
  });
});
