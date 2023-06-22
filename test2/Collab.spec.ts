import { Project } from "../src/model/Project";
import { Activity } from "../src/model/Activity";
import { Collab } from "../src/model/Collab";
import { Raison } from "../src/model/Raison";
import { Absence } from "../src/model/Absence";
import { Role } from "src/model/Role";

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





    it('peut ajouter une activite pour le mois courant ',()=>{
        //et si modif le 5 du mois?
        const collab=new Collab();
        const projet=new Project();
        projet.addCollab(collab);
        const validDate =new Date();
        const activite=new Activity(collab,projet,false,validDate,[]);

        expect(activite.date).toBe(validDate);
        
        
    });



    //ou constructeur ??

    it('peut avoir le role admin ',()=>{
        //et si modif le 5 du mois?
        const collab=new Collab();
        collab.role=Role.admin;

        expect(collab.role).toBe(Role.admin);
        
        
    });

    it('peut avoir le role user ',()=>{
        //et si modif le 5 du mois?
        const collab=new Collab();
        collab.role=Role.user;

        expect(collab.role).toBe(Role.user);
        
        
    });

   


})