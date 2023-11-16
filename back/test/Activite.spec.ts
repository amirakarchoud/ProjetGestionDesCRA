import { Activity } from '@app/domain/model/Activity';
import { Project } from '@app/domain/model/Project';
import { ProjetStatus } from '@app/domain/model/projetStatus.enum';
import { ProjectCode } from '@app/domain/model/project.code';
import { CollabEmail } from '@app/domain/model/collab.email';
import { createCra } from './utils';
import { Collab } from '@app/domain/model/Collab';
import { Role } from '@app/domain/model/Role';
import { LocalDate } from '@js-joda/core';

describe('Une activite ', () => {
  let projet: Project;
  const collabEmail = new CollabEmail('user@proxym.fr');

  beforeEach(() => {
    projet = new Project(
      new ProjectCode('123'),
      [],
      '',
      '',
      LocalDate.now(),
      ProjetStatus.Active,
    );
  });

  it('ne peut pas avoir des attributs null', () => {
    //Then
    expect(() => new Activity(null, 100, LocalDate.now())).toThrowError(
      'cannot have a null attribut',
    );

    expect(() => new Activity(projet.code, null, LocalDate.now())).toThrowError(
      'cannot have a null attribut',
    );

    expect(() => new Activity(projet.code, 100, null)).toThrowError(
      'cannot have a null attribut',
    );
  });

  it('peut etre cree par un collab', () => {
    //When
    const activity = new Activity(projet.code, 100, LocalDate.now());

    //Then
    expect(activity).toBeDefined();
  });

  it('est associee a un projet', () => {
    //When
    projet.addCollab(collabEmail);
    const activity = new Activity(projet.code, 100, LocalDate.now());

    //Then
    expect(activity.project).toEqual(new ProjectCode('123'));
  });

  it('est associee a une date', () => {
    //given
    const date = LocalDate.now();

    //When
    projet.addCollab(collabEmail);
    const activity = new Activity(projet.code, 100, date);

    //Then
    expect(activity.date).toBe(date);
  });

  it('est associee a un cra', () => {
    //given
    const collab = new Collab(
      new CollabEmail('user@proxym.fr'),
      'test',
      'last name',
      Role.admin,
    );
    const date = LocalDate.now();
    const cra = createCra(collab, date);
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
      LocalDate.parse('2023-09-01'),
    );

    expect(activity.toJSON()).toEqual({
      date: '2023-09-01',
      percentage: 25,
      project: 'proj',
    });
  });
});
