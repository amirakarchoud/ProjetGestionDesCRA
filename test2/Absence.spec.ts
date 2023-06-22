import { Collab } from "../src/model/Collab";
import { Raison } from "src/model/Raison";
import { Absence } from "src/model/Absence";

describe('Une absence ',()=>{


    it('peut etre cree par un collab',()=>{
         //given 
        
         const collab= new Collab();
 
         expect(new Absence(collab,false,new Date(),Raison.maladie)).toBeDefined();
    });

    it('peut avoir un raison',()=>{
        //given 
       
        const collab= new Collab();

        const absence=new Absence(collab,false,new Date(),Raison.maladie);

        expect(absence.raison).toBe(Raison.maladie);
   });




})