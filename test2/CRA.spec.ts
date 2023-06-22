import { CRA } from "../src/model/CRA";
import { Activity } from "../src/model/Activity";
import { Collab } from "../src/model/Collab";
import { Project } from "../src/model/Project";
import { Absence } from "../src/model/Absence";
import { Raison } from "../src/model/Raison";
import { ForbiddenException } from "@nestjs/common";

describe('Un CRA ', () => {
    it('peut contenir des activites ', () => {
        //Given
        const collab = new Collab();
        const projet = new Project();
        projet.addCollab(collab);
        const activity = new Activity(collab, projet, true, new Date(), []);

        const date=new Date();
        //When
        const cra=new CRA(date.getMonth()+1,date.getFullYear());
        cra.addActivity(activity);

        //Then
        expect(cra.activites).toHaveLength(1);

    });

    it('peut contenir des absences', () => {

        //Given
        const collab = new Collab();
        const absence = new Absence(collab, true, new Date(),Raison.maladie);

        const date=new Date();
        //When
        const cra=new CRA(date.getMonth()+1,date.getFullYear());
        cra.addAbsence(absence);

        //Then
        expect(cra.absences).toHaveLength(1);

    });

    it('ne peut pas contenir des jours vides :verifier le total absence+activite+ferie==jours ouvre', () => {
        const collab=new Collab();
        const projet=new Project();
        projet.addCollab(collab);
        const date = new Date(); 
        let tomorrow = new Date();
        tomorrow.setDate(date.getDate() +1);
        const activite1=new Activity(collab,projet,false,new Date(),[]);
        const absence=new Absence(collab,true,new Date(),Raison.maladie);
        const activite3=new Activity(collab,projet,false,tomorrow,[]);

        
        //When
        const cra=new CRA(date.getMonth()+1,date.getFullYear());
        cra.addActivity(activite1);
        cra.addAbsence(absence);
        cra.addActivity(activite3);

        //then
        expect(cra.verifyTotalDays()).toBe(false);


    });

    it('peut contenir des jours feries', () => {
        const cra=new CRA(7,2023);
        cra.fetchHolidays();
       // expect(cra.holidays).toHaveLength(1);


    });

    it('ne peut contenir des activites ou absences que pour le meme mois', () => {

        const collab = new Collab();
        const projet = new Project();
        projet.addCollab(collab);
        const activity = new Activity(collab, projet, true, new Date(), []);
        const absence = new Absence(collab, true, new Date("02-04-2023"),Raison.maladie);
        const cra=new CRA(6,2023);
    //when
    cra.addActivity(activity);

    //then
    
    expect(cra.activites).toHaveLength(1);

    expect(()=>{cra.addAbsence(absence)}).toThrowError();

    });



   
    it('test to fail :peut ajouter une activite que pour le mois courant ou 5 jours après le mois precedent',()=>{
        //et si modif le 5 du mois?
        const collab=new Collab();
        const projet=new Project();
        projet.addCollab(collab);
        const oldActivity=new Activity(collab,projet,false,new Date("2023-05-02"),[]);

        const cra=new CRA(5,2023);
        expect(()=>{cra.addActivity(oldActivity)}).toThrow(ForbiddenException);
        
        
    });




    it('ne peut pas contenir 2 activites ou absences dans le meme creneau',()=>{
        //check l'ensemble de ses activites(array activities) et calcul

        const collab=new Collab();
        const projet=new Project();
        projet.addCollab(collab);
        const activite1=new Activity(collab,projet,false,new Date(),[]);
        const activite2=new Activity(collab,projet,false,new Date(),[]);

        const date=new Date();
        //When
        const cra=new CRA(date.getMonth()+1,date.getFullYear());
        cra.addActivity(activite1);
        
        expect(()=>{cra.addActivity(activite2)}).toThrowError();
        
    });

    it('ne peut pas contenir plus que 2 activites ou absences par jour',()=>{
        //check l'ensemble de ses activites(array activities) et calcul

        const collab=new Collab();
        const projet=new Project();
        projet.addCollab(collab);
        const activite1=new Activity(collab,projet,false,new Date(),[]);
        const absence=new Absence(collab,true,new Date(),Raison.maladie);
        const activite3=new Activity(collab,projet,false,new Date(),[]);

        const date=new Date();
        //When
        const cra=new CRA(date.getMonth()+1,date.getFullYear());
        cra.addActivity(activite1);
        cra.addAbsence(absence);
        
        expect(()=>{cra.addActivity(activite3)}).toThrowError();
        
    });

    it('peut reccuperer les jours vides du mois',()=>{
        //=jours - (activities + absences)
        const collab=new Collab();
        const projet=new Project();
        projet.addCollab(collab);
        const date = new Date(); 
        let tomorrow = new Date();
        tomorrow.setDate(date.getDate() +1);
        const activite1=new Activity(collab,projet,false,new Date(),[]);
        const absence=new Absence(collab,true,new Date(),Raison.maladie);
        const activite3=new Activity(collab,projet,false,tomorrow,[]);

        
        //When
        const cra=new CRA(date.getMonth()+1,date.getFullYear());
        cra.addActivity(activite1);
        cra.addAbsence(absence);
        cra.addActivity(activite3)

        //then
        const businessDays=cra.calculateBusinessDays(date.getMonth()+1,date.getFullYear());
        expect(cra.calculateEmptyDays()).toBe(businessDays-(3 * 0.5));

        
    });



  
    


})