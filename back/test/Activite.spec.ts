import { Activity } from '@app/domain/model/Activity';
import { CRA } from '@app/domain/model/CRA';
import { Collab } from '@app/domain/model/Collab';
import { Project } from '@app/domain/model/Project';
import { Role } from '@app/domain/model/Role';
import { Etat } from '@app/domain/model/etat.enum';
import { Status } from '@app/domain/model/Status';

describe('Une activite ', () => {
  it('ne peut pas avoir des attributs null', () => {
    //given
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

    const projet = new Project('123', []);
    projet.addCollab(collab.email);
    //Then

    expect(() => new Activity(null, true, new Date(), cra.id)).toThrowError(
      'cannot have a null attribut',
    );

    expect(() => new Activity(projet, null, new Date(), cra.id)).toThrowError(
      'cannot have a null attribut',
    );
  });

  it('peut etre cree par un collab', () => {
    //given
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

    const projet = new Project('123', []);
    projet.addCollab(collab.email);
    //When
    const activity = new Activity(projet, true, new Date(), cra.id);

    //Then
    expect(activity).toBeDefined();
  });

  it('est associee a un projet', () => {
    //given
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

    const projet = new Project('123', []);
    projet.addCollab(collab.email);
    const activity = new Activity(projet, true, new Date(), cra.id);

    //Then
    expect(activity.project).toBe(projet);
  });

  it('est associee a une date', () => {
    //given
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

    const projet = new Project('123', []);
    projet.addCollab(collab.email);
    const activity = new Activity(projet, true, date, cra.id);

    //Then
    expect(activity.date).toBe(date);
  });
  it('est associee a un cra', () => {
    //given
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

    const projet = new Project('123', []);
    projet.addCollab(collab.email);
    const activity = new Activity(projet, true, date, cra.id);

    //Then
    expect(activity.cra).toBe(cra.id);
  });
});
