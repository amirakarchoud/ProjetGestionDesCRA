import { Project } from "../src/model/Project";
import { Activity } from "../src/model/Activity";
import { Collab } from "../src/model/Collab";
import { ForbiddenException } from "@nestjs/common";

describe('Collaborateur ',()=>{
    it('peut creer une activite ',()=>{
        //given
        const collab= new Collab();
        const myProject =new Project()
 
        //when
        myProject.addCollab(collab);
        collab.addActivity(new Activity(collab,myProject,false,new Date()));
        //then
        expect(collab.activities).toHaveLength(1);


    });

    it('peut generer son CRA pour le mois :verifier le total absence+activite+ferie==jours ouvre ',()=>{
        
    });

    it('peut modifier son propre CRA',()=>{
        
    });

    it('peut modifier son CRA avant le 5 du mois suivant',()=>{
        
    });


    it('peut ajouter une activite que pour le mois courant',()=>{
        const collab=new Collab();
        const projet=new Project();
        projet.addCollab(collab);

        expect(()=>{new Activity(collab,projet,false,new Date("2023-05-02"))}).toThrow(ForbiddenException);
        
        
    });

   

    it('peut ajouter que 2 activites ou absences par jour',()=>{
        //check l'ensemble de ses activites(array activities) et calcul
        
    });

    it('peut reccuperer les jours vides du mois',()=>{
        //=jours - (activities + absences)
        
    });


})