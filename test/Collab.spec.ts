import { Collab } from '../src/model/Collab';

describe('Collab', () => {
  let collab: Collab;

  beforeEach(() => {
    collab = new Collab('1', 'John', 'Doe', new Date());
  });

  it('should add a collab', () => {
    const newCollab = new Collab('2', 'Jane', 'Smith', new Date());
    collab.add(newCollab);
    expect(collab.getAll()).toContain(newCollab);
  });


  it('should get the ID', () => {
    expect(collab.getId()).toBe('1');
  });

  it('should set and get the nom', () => {
    collab.setNom('Smith');
    expect(collab.getNom()).toBe('Smith');
  });

  it('should set and get the prenom', () => {
    collab.setPrenom('Jane');
    expect(collab.getPrenom()).toBe('Jane');
  });

  it('should set and get the dateEmbauche', () => {
    const date = new Date('2022-01-01');
    collab.setDateEmbauche(date);
    expect(collab.getDateEmbauche()).toEqual(date);
  });

  /*
  it('should get a collab by id', () => {
    const retrievedCollab = collab.getById('1');
    expect(retrievedCollab).toEqual(collab);
  });
  */

  it('should delete a collab', () => {
    collab.delete('1');
    expect(collab.getAll()).toHaveLength(0);
  });

  /*

  it('should update a collab', () => {
    const updatedCollab = new Collab('1', 'Updated', 'Name', new Date());
    collab.update('1', updatedCollab);
    const retrievedCollab = collab.getById('1');
    expect(retrievedCollab).toEqual(updatedCollab);
  })
  ;
  */
});
