import { Activity } from '@app/domain/model/Activity';
import { CRA } from '@app/domain/model/CRA';
import { Project } from '@app/domain/model/Project';
import { Etat } from '@app/domain/model/etat.enum';
import { Status } from '@app/domain/model/Status';
import { ProjetStatus } from '@app/domain/model/projetStatus.enum';
import { ProjectCode } from '@app/domain/model/project.code';
import { CollabEmail } from '@app/domain/model/collab.email';

describe('Une activite ', () => {
  let projet: Project;
  const collabEmail = new CollabEmail('user@proxym.fr');

  beforeEach(() => {
    projet = new Project(
      new ProjectCode('123'),
      [],
      '',
      '',
      new Date(),
      ProjetStatus.Active,
    );
  });

  it('ne peut pas avoir des attributs null', () => {
    //given
    const date = new Date();
    const cra = new CRA(
      date.getMonth() + 1,
      date.getFullYear(),
      collabEmail,
      Etat.unsubmitted,
      Status.Open,
    );

    projet.addCollab(collabEmail);
    //Then

    expect(() => new Activity(null, 100, new Date())).toThrowError(
      'cannot have a null attribut',
    );

    expect(() => new Activity(projet.code, null, new Date())).toThrowError(
      'cannot have a null attribut',
    );

    expect(() => new Activity(projet.code, 100, null)).toThrowError(
      'cannot have a null attribut',
    );
  });

  it('peut etre cree par un collab', () => {
    //given
    const date = new Date();
    const cra = new CRA(
      date.getMonth() + 1,
      date.getFullYear(),
      collabEmail,
      Etat.unsubmitted,
      Status.Open,
    );

    projet.addCollab(collabEmail);
    //When
    const activity = new Activity(projet.code, 100, new Date());

    //Then
    expect(activity).toBeDefined();
  });

  it('est associee a un projet', () => {
    //given
    const date = new Date();
    const cra = new CRA(
      date.getMonth() + 1,
      date.getFullYear(),
      collabEmail,
      Etat.unsubmitted,
      Status.Open,
    );
    //When
    projet.addCollab(collabEmail);
    const activity = new Activity(projet.code, 100, new Date());

    //Then
    expect(activity.project).toEqual(new ProjectCode('123'));
  });

  it('est associee a une date', () => {
    //given
    const date = new Date();
    const cra = new CRA(
      date.getMonth() + 1,
      date.getFullYear(),
      collabEmail,
      Etat.unsubmitted,
      Status.Open,
    );
    //When

    projet.addCollab(collabEmail);
    const activity = new Activity(projet.code, 100, date);

    //Then
    expect(activity.date).toBe(date);
  });

  it('est associee a un cra', () => {
    //given
    const date = new Date();
    const cra = new CRA(
      date.getMonth() + 1,
      date.getFullYear(),
      collabEmail,
      Etat.unsubmitted,
      Status.Open,
    );
    //When
    projet.addCollab(collabEmail);
    const activity = new Activity(projet.code, 100, date);
    cra.addActivity(activity);

    //Then
    expect(cra.activities).toContain(activity);
  });

  it('peut être converti en json', () => {
    const activity = new Activity(
      new ProjectCode('proj'),
      25,
      new Date('2023-09-01'),
    );

    expect(activity.toJSON()).toEqual({
      date: '2023-09-01T00:00:00.000Z',
      percentage: 25,
      project: 'proj',
    });
  });
});
