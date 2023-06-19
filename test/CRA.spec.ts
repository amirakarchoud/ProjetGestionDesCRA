import { Projet } from "../src/model/Projet";
import { Activite } from "../src/model/Activite";
import { CRA } from "../src/model/CRA";
import { Collab } from "../src/model/Collab";
import { Absence } from "src/model/Absence";
import { Raison } from "src/model/Raison";


describe('CRA', () => {
  let cra: CRA;
  let activities: Activite[];
  let collab: Collab;
  let date: Date;
  let projet: Projet;
  let absences:Absence;

  beforeEach(() => {
    activities = [
      new Activite('1', new Date(), true, collab, projet),
      new Activite('2', new Date(), false, collab, projet),
    ];
    collab = new Collab('1', 'John', 'Doe', new Date());
    absences = new Absence('1',new Date(),false,collab,Raison.Conges);
    date = new Date('2023-06-18');
    projet = new Projet('123', 'Project', [collab]);

    cra = new CRA('789', activities,[absences], collab, date);
  });

  it('cannot contain work on holidays')

  it('should get the ID', () => {
    expect(cra.getId()).toBe('789');
  });

  it('should set and get the activities', () => {
    const newActivities = [
      new Activite('3', new Date(), true, collab, projet),
      new Activite('4', new Date(), false, collab, projet),
    ];
    cra.setActivities(newActivities);
    expect(cra.getActivities()).toEqual(newActivities);
  });

  it('should set and get the collab', () => {
    const newCollab = new Collab('2', 'Jane', 'Smith', new Date());
    cra.setCollab(newCollab);
    expect(cra.getCollab()).toEqual(newCollab);
  });

  it('should set and get the date', () => {
    const newDate = new Date('2023-06-19');
    cra.setDate(newDate);
    expect(cra.getDate()).toEqual(newDate);
  });

 
});
