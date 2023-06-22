import { ForbiddenException } from "@nestjs/common";
import { Activity } from "../src/model/Activity";
import { Collab } from "../src/model/Collab";
import { Project } from "../src/model/Project";
import { HolidayAdapter } from "../src/model/HolidayAdapter";

describe('Une activite ',()=>{

    it('ne peut pas tomber sur un jour ferie',()=>{
        const holidayAdapter = new HolidayAdapter();

holidayAdapter.getHolidays()
  .then((holidays) => {
    const collab= new Collab();
   const myProject =new Project();
    const dateHoliday=new Date(holidays[0].date);
   //when
   myProject.addCollab(collab);
   //then
   
   expect(()=>{new Activity(collab,myProject,false,dateHoliday,holidays)}).toThrow(ForbiddenException);

  })
  .catch((error) => {
    console.error(error);
  });
   

        
    });

    it('peut etre cree par un collab',()=>{
         //given 
        
         const collab= new Collab();
         const collab2= new Collab();
        
         const myProject =new Project()
 
         //when
         myProject.addCollab(collab);
         myProject.addCollab(collab2);
         //then
 
         expect(new Activity(collab,myProject,false,new Date(),[])).toBeDefined();
    });

    it('ne peut pas etre associee que au projet du son collab',()=>{
        //given 
       
        const collab= new Collab();
        const collab2= new Collab();
       
        const otherProject =new Project()

        //when
        otherProject.addCollab(collab2);

        //then
        expect(()=>{new Activity(collab,otherProject,false,new Date(),[])}).toThrow(ForbiddenException);

   });


})