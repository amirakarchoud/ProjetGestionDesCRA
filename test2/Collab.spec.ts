import { Project } from "../src/model/Project";
import { Activity } from "../src/model/Activity";
import { Collab } from "../src/model/Collab";
import { ForbiddenException } from "@nestjs/common";
import { Raison } from "../src/model/Raison";
import { Absence } from "../src/model/Absence";

describe('Collaborateur ',()=>{
    it('peut creer une activite ',()=>{
        //given
        const collab= new Collab();
        const myProject =new Project();
 
        //when
        myProject.addCollab(collab);
        collab.addActivity(new Activity(collab,myProject,false,new Date(),[]));
        //then
        expect(collab.activities).toHaveLength(1);


    });

    it('peut creer une absence ',()=>{
        //given
        const collab= new Collab();
 
        //when
        collab.addAbsence(new Absence(collab,false,new Date(),Raison.rtt));
        //then
        expect(collab.absences).toHaveLength(1);


    });

    it('peut generer son CRA pour le mois :verifier le total absence+activite+ferie==jours ouvre ',()=>{
        
    });

    it('peut modifier son propre CRA',()=>{
        
    });

    it('peut modifier son CRA avant le 5 du mois suivant',()=>{
        
    });


    it('test to fail :peut ajouter une activite que pour le mois courant ou 5 jours après le mois precedent',()=>{
        //et si modif le 5 du mois?
        const collab=new Collab();
        const projet=new Project();
        projet.addCollab(collab);

        expect(()=>{new Activity(collab,projet,false,new Date("2023-05-02"),[])}).toThrow(ForbiddenException);
        
        
    });


    it('peut ajouter une activite pour le mois courant ou 5 jours après le mois precedent',()=>{
        //et si modif le 5 du mois?
        const collab=new Collab();
        const projet=new Project();
        projet.addCollab(collab);
        const validDate =new Date();
        const activite=new Activity(collab,projet,false,validDate,[]);

        expect(activite.date).toBe(validDate);
        
        
    });

   

    it('peut ajouter que 2 activites ou absences par jour',()=>{
        //check l'ensemble de ses activites(array activities) et calcul
        
    });

    it('peut reccuperer les jours vides du mois',()=>{
        //=jours - (activities + absences)
        
    });


})