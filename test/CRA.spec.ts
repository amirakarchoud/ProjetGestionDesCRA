
import { Project } from "../src/domain/model/Project";
import { Absence } from "../src/domain/model/Absence";
import { CRA } from "../src/domain/model/CRA";
import { Collab } from "../src/domain/model/Collab";
import { Raison } from "../src/domain/model/Raison";
import { Role } from "../src/domain/model/Role";
import { Activity } from "../src/domain/model/Activity";
import { Etat } from "../src/domain/model/etat.enum";
import { ForbiddenException } from "@nestjs/common";

describe('Un CRA ', () => {
    it('peut supprimer des absences', () => {

        //given
        const today = new Date();
        const cra = new CRA(1, 3, 2023, new Collab("user", "test", Role.admin), new Date(), Etat.unsubmitted);
        cra.addAbsence(new Absence(1, true, today, Raison.maladie));

        expect(cra.absences.length).toBe(1);
        //when
        cra.deleteAbsence(today, true);
        //then 
        expect(cra.absences.length).toBe(0);

    });

    it('ne peut pas contenir 2 activites ou absences dans le meme creneau', () => {
        //Given
        const date = new Date();
        const collab = new Collab("user", "test", Role.admin);
        const cra = new CRA(1, date.getMonth(), date.getFullYear(), collab, new Date(), Etat.unsubmitted);
        const projet = new Project("123", []);
        projet.addCollab(collab.email);
        const activity = new Activity(cra.id, collab, projet, true, new Date(), cra);
        const absence = new Absence(1, true, date, Raison.maladie)


        //When
        cra.addActivity(activity);

        //Then
        expect(() => { cra.addAbsence(absence) }).toThrow(Error("FULL day or period"));
        expect(cra.activities).toHaveLength(1);

    });


    it('ne peut pas contenir plus que 2 activites ou absences par jour', () => {
        //Given
        const date = new Date();
        const collab = new Collab("user", "test", Role.admin);
        const cra = new CRA(1, date.getMonth(), date.getFullYear(), collab, new Date(), Etat.unsubmitted);
        const projet = new Project("123", []);
        projet.addCollab(collab.email);
        const activity = new Activity(cra.id, collab, projet, true, new Date(), cra);
        const activity2 = new Activity(cra.id, collab, projet, false, new Date(), cra);
        const absence = new Absence(1, true, date, Raison.maladie);


        //When
        cra.addActivity(activity);
        cra.addActivity(activity2);

        //Then
        expect(() => { cra.addAbsence(absence) }).toThrow(Error("FULL day or period"));
        expect(cra.activities).toHaveLength(2);
        expect(cra.absences.length).toBe(0);

    });

    it('ne peut pas ajouter une absence apres le 5 du mois suivant', () => {
        //Given
        const date = new Date();
        const collab = new Collab("user", "test", Role.admin);
        const cra = new CRA(1, 6, date.getFullYear(), collab, new Date(), Etat.unsubmitted);

        //When
        const absence = new Absence(cra.id, true, new Date("02-06-2023"), Raison.maladie);

        //Then
        expect(() => { cra.addAbsence(absence) }).toThrow(ForbiddenException);


    });



    it("ne peut pas supprimer une absence qui n'existe pas", () => {


        //given
        const today = new Date();
        const cra = new CRA(1, 3, 2023, new Collab("user", "test", Role.admin), new Date(), Etat.unsubmitted);
        cra.addAbsence(new Absence(1, true, today, Raison.maladie));

        expect(cra.absences.length).toBe(1);
        cra.deleteAbsence(today, false);

        expect(cra.absences.length).toBe(1);


    });

    it('peut ajouter/contenir des activites ', () => {
        //Given
        const date = new Date();
        const collab = new Collab("user", "test", Role.admin);
        const cra = new CRA(1, date.getMonth(), date.getFullYear(), collab, new Date(), Etat.unsubmitted);
        const projet = new Project("123", []);
        projet.addCollab(collab.email);
        const activity = new Activity(cra.id, collab, projet, true, new Date(), cra);


        //When
        cra.addActivity(activity);

        //Then
        expect(cra.activities).toHaveLength(1);

    });
    it('peut ajouter/contenir des absences ', () => {
        //Given
        const date = new Date();
        const collab = new Collab("user", "test", Role.admin);
        const cra = new CRA(1, date.getMonth(), date.getFullYear(), collab, new Date(), Etat.unsubmitted);
        const absence = new Absence(cra.id, true, new Date(), Raison.maladie);


        //When
        cra.addAbsence(absence);

        //Then
        expect(cra.absences).toHaveLength(1);

    });

    it('ne peut pas etre soumis si il contient des jours vides ', () => {
        //Given
        const date = new Date();
        const collab = new Collab("user", "test", Role.admin);
        const cra = new CRA(1, date.getMonth(), date.getFullYear(), collab, new Date(), Etat.unsubmitted);
        const absence = new Absence(cra.id, true, new Date(), Raison.maladie);
        const absence2 = new Absence(cra.id, false, new Date(), Raison.maladie);

        //When
        cra.addAbsence(absence);
        cra.addAbsence(absence2);

        //Then
        expect(cra.SubmitCra()).toBe(false);



    });


    it('peut être soumis si tous les jours sont remplis', () => {
        // Given
        const projet = new Project("123", []);

        const date = new Date();
        const collab = new Collab("user", "test", Role.admin);
        projet.addCollab(collab.email);
        const cra = new CRA(1, date.getMonth() + 1, date.getFullYear(), collab, new Date(), Etat.unsubmitted);
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        // Fill all days with activities

        for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
            if (!cra.isWeekend(new Date(currentDate))) {
                const abs = new Absence(cra.id, true, new Date(currentDate), Raison.maladie);
                const act = new Activity(cra.id, collab, projet, false, new Date(currentDate), cra);
                cra.addAbsence(abs);
                cra.addActivity(act);
            }
        }

        // When
        const result = cra.SubmitCra();

        // Then
        expect(result).toBe(true);
    });

    it('peut retourner les dates vides', () => {
        // Given
        const projet = new Project("123", []);
        const date = new Date();
        const collab = new Collab("user", "test", Role.admin);
        projet.addCollab(collab.email);
        const cra = new CRA(1, date.getMonth() + 1, date.getFullYear(), collab, new Date(), Etat.unsubmitted);
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);


        const activity = new Activity(cra.id, collab, projet, false, new Date(startDate), cra);
        const activity2 = new Activity(cra.id, collab, projet, true, new Date(startDate), cra);
        const absence = new Absence(cra.id, true, new Date(endDate), Raison.maladie);
        cra.addActivity(activity);
        cra.addActivity(activity2);
        cra.addAbsence(absence);

        // When
        const emptyDates = cra.getAvailableDatesOfCra();

        // Then
        for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
            if (cra.isWeekend(currentDate) || cra.checkDateIsHoliday(currentDate) || cra.checkDayIsFull(currentDate)) {
                expect(emptyDates).not.toContainEqual(currentDate);
            } else {
                expect(emptyDates).toContainEqual(currentDate);
            }
        }
    });


    /*  
  
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
     // cra.addActivity(activity);
  
      //then
      
      //expect(cra.activites).toHaveLength(1);
  
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
         // expect(cra.calculateEmptyDays()).toBe(businessDays-(3 * 0.5));
  
          
      });
  
  
  
    
   */


})