import { Collab } from '@app/domain/model/Collab';
import { Project } from '@app/domain/model/Project';
import { Role } from '@app/domain/model/Role';
import { ProjetStatus } from '@app/domain/model/projetStatus.enum';
import { ProjectCode } from '@app/domain/model/project.code';
import { CollabEmail } from '@app/domain/model/collab.email';
import { LocalDate } from '@js-joda/core';

describe('Un projet ', () => {
  //Given
  const collab = new Collab(
    new CollabEmail('user@proxym.fr'),
    'test',
    'last name',
    Role.admin,
  );

  it('ne peut pas avoir des attributs null', () => {
    expect(
      () => new Project(null, [], '', '', LocalDate.now(), ProjetStatus.Active),
    ).toThrowError('cannot have a null attribut');

    expect(
      () =>
        new Project(
          new ProjectCode('111'),
          null,
          '',
          '',
          LocalDate.now(),
          ProjetStatus.Active,
        ),
    ).toThrowError('cannot have a null attribut');
  });

  it('peut etre cree ', () => {
    const projet = new Project(
      new ProjectCode('123'),
      [],
      '',
      '',
      LocalDate.now(),
      ProjetStatus.Active,
    );
    expect(projet).toBeDefined();
  });

  it('doit etre coorrectement creé ', () => {
    const date = LocalDate.now();
    const projet = new Project(
      new ProjectCode('123'),
      [],
      'name of project',
      'client 112',
      date,
      ProjetStatus.Active,
    );
    expect(projet.code.value).toBe('123');
    expect(projet.name).toBe('name of project');
    expect(projet.client).toBe('client 112');
    expect(projet.date).toBe(date);
    expect(projet.status).toBe(ProjetStatus.Active);
  });

  it('peut contenir des collaborateurs', () => {
    //given
    const projet = new Project(
      new ProjectCode('123'),
      [],
      '',
      '',
      LocalDate.now(),
      ProjetStatus.Active,
    );
    //when
    projet.addCollab(collab.email);

    //then
    expect(projet.collabs).toHaveLength(1);
  });

  it('peut etre affecter des collaborateurs', () => {
    //given
    const projet = new Project(
      new ProjectCode('123'),
      [collab.email],
      '',
      '',
      LocalDate.now(),
      ProjetStatus.Active,
    );

    //then
    expect(projet.collabs).toHaveLength(1);
  });

  it('peut etre desactive', () => {
    //given
    const projet = new Project(
      new ProjectCode('123'),
      [],
      '',
      '',
      LocalDate.now(),
      ProjetStatus.Active,
    );
    //when
    projet.desctivateProject();

    //then
    expect(projet.status).toBe(ProjetStatus.Desactive);
  });
});
