import { Collab } from '@app/domain/model/Collab';
import { Project } from '@app/domain/model/Project';
import { Role } from '@app/domain/model/Role';

describe('Un projet ', () => {
  //Given
  const collab = new Collab('user', 'test', 'last name', Role.admin);

  it('ne peut pas avoir des attributs null', () => {
    expect(() => new Project(null, [])).toThrowError(
      'cannot have a null attribut',
    );

    expect(() => new Project('111', null)).toThrowError(
      'cannot have a null attribut',
    );
  });

  it('peut etre cree ', () => {
    const projet = new Project('123', []);
    expect(projet).toBeDefined();
  });

  it('peut contenir des collaborateurs', () => {
    //given
    const projet = new Project('123', []);
    //when
    projet.addCollab(collab.email);

    //then
    expect(projet.collabs).toHaveLength(1);
  });

  it('peut etre affecter des collaborateurs', () => {
    //given
    const projet = new Project('123', [collab.email]);

    //then
    expect(projet.collabs).toHaveLength(1);
  });
});
