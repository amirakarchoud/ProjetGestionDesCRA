import { Activite } from "../src/model/Activite";
import { Collab } from "../src/model/Collab";
import { Projet } from "../src/model/Projet";


describe('Activite', () => {
  let activite: Activite;
  let collab: Collab;
  let projet: Projet;

  beforeEach(() => {
    collab = new Collab('1', 'John', 'Doe', new Date());
    projet = new Projet('123', 'ABC', []);

    activite = new Activite('456', new Date(), true, collab, projet);
  });

  it('should get the ID', () => {
    expect(activite.getId()).toBe('456');
  });

  it('should set and get the date', () => {
    const date = new Date('2023-06-18');
    activite.setDate(date);
    expect(activite.getDate()).toEqual(date);
  });

  it('should set and get the "matin" value', () => {
    activite.setMatin(false);
    expect(activite.isMatin()).toBe(false);
  });

  it('should set and get the collab', () => {
    const newCollab = new Collab('2', 'Jane', 'Smith', new Date());
    activite.setCollab(newCollab);
    expect(activite.getCollab()).toEqual(newCollab);
  });

  it('should set and get the projet', () => {
    const newProjet = new Projet('789', 'DEF', []);
    activite.setProjet(newProjet);
    expect(activite.getProjet()).toEqual(newProjet);
  });
});
