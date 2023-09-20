import { Collab } from '@app/domain/model/Collab';
import { Project } from '@app/domain/model/Project';
import { Role } from '@app/domain/model/Role';
import { ProjetStatus } from '@app/domain/model/projetStatus.enum';
import { ProjectCode } from '@app/domain/model/project.code';

describe('Collaborateur ', () => {
  //Given
  const projet = new Project(
    new ProjectCode('123'),
    [],
    '',
    '',
    new Date(),
    ProjetStatus.Active,
  );

  it('est cree correctement ', () => {
    //given
    const collab = new Collab('user', 'test', 'last name', Role.admin);
    collab.password = 'pass';
    //then
    expect(collab.role).toBe(Role.admin);
    expect(collab.email).toBe('user');
    expect(collab.name).toBe('test');
    expect(collab.password).toBe('pass');
    expect(collab.lastname).toBe('last name');
  });

  it('peut avoir le role admin ', () => {
    //given
    const collab = new Collab('user', 'test', 'last name', Role.admin);
    //then
    expect(collab.role).toBe(Role.admin);
  });

  it('peut avoir le role user ', () => {
    //given
    const collab = new Collab('user', 'test', 'last name', Role.user);
    //then
    expect(collab.role).toBe(Role.user);
  });
  it('peut avoir des projets ', () => {
    //given
    const collab = new Collab('user', 'test', 'last name', Role.admin);
    //when
    collab.addProject(projet.code);
    //then
    expect(collab.projects).toHaveLength(1);
  });
});
