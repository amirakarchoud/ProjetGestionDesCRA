import { Collab } from '@app/domain/model/Collab';
import { Project } from '@app/domain/model/Project';
import { Role } from '@app/domain/model/Role';
import { ProjectStatus } from '@app/domain/model/projetStatus.enum';
import { ProjectCode } from '@app/domain/model/project.code';
import { CollabEmail } from '@app/domain/model/collab.email';
import { LocalDate } from '@js-joda/core';

describe('Collaborateur ', () => {
  //Given
  const projet = new Project(
    new ProjectCode('123'),
    [],
    '',
    '',
    LocalDate.now(),
    ProjectStatus.Active,
  );

  const collabAdmin = new Collab(
    new CollabEmail('user-admin@proxym.fr'),
    'test',
    'last name',
    Role.admin,
  );
  const collabUser = new Collab(
    new CollabEmail('user@proxym.fr'),
    'test',
    'last name',
    Role.user,
  );

  it('est cree correctement ', () => {
    //given
    const collab = collabAdmin;
    collab.password = 'pass';
    //then
    expect(collab.role).toBe(Role.admin);
    expect(collab.email).toEqual(collabAdmin.email);
    expect(collab.name).toBe('test');
    expect(collab.password).toBe('pass');
    expect(collab.lastname).toBe('last name');
  });

  it('peut avoir le role admin ', () => {
    //given
    //then
    expect(collabAdmin.role).toBe(Role.admin);
  });

  it('peut avoir le role user ', () => {
    //given
    //then
    expect(collabUser.role).toBe(Role.user);
  });
  it('peut avoir des projets ', () => {
    //given
    const collab = collabAdmin;
    //when
    collab.addProject(projet.code);
    //then
    expect(collab.projects).toHaveLength(1);
  });
});
