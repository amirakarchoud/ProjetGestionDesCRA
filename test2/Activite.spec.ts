import { ForbiddenException } from "@nestjs/common";
import { Activity } from "../src/model/Activity";
import { Collab } from "../src/model/Collab";
import { Project } from "../src/model/Project";

describe('Une activite ',()=>{

    it('ne peut pas tomber sur un jour ferie',()=>{
        
    });

    it('peut etre associee que au projet du son collab',()=>{
         //given 
        
         const collab= new Collab();
         const collab2= new Collab();
        
         const myProject =new Project()
 
         //when
         myProject.addCollab(collab);
         myProject.addCollab(collab2);
         //then
 
         expect(new Activity(collab,myProject,false,new Date())).toBeDefined();
    });

    it('ne peut pas etre associee que au projet du son collab',()=>{
        //given 
       
        const collab= new Collab();
        const collab2= new Collab();
       
        const otherProject =new Project()

        //when
        otherProject.addCollab(collab2);

        //then
        expect(()=>{new Activity(collab,otherProject,false,new Date())}).toThrow(ForbiddenException);

   });


})