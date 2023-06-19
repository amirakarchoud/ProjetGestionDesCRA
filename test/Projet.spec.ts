import { Collab } from "../src/model/Collab";
import { Projet } from "../src/model/Projet";


describe('Projet', () => {
  let projet: Projet;
  let collabs: Collab[];

  beforeEach(() => {
    collabs = [
      new Collab('1', 'John', 'Doe', new Date()),
      new Collab('2', 'Jane', 'Smith', new Date()),
    ];

    projet = new Projet('123', 'ABC', collabs);
  });

  it('should get the ID', () => {
    expect(projet.getId()).toBe('123');
  });

  it('should set and get the code', () => {
    projet.setCode('DEF');
    expect(projet.getCode()).toBe('DEF');
  });

  it('should set and get the collabs', () => {
    const newCollabs = [
      new Collab('3', 'Alice', 'Johnson', new Date()),
      new Collab('4', 'Bob', 'Williams', new Date()),
    ];

    projet.setCollabs(newCollabs);
    expect(projet.getCollabs()).toEqual(newCollabs);
  });
});
