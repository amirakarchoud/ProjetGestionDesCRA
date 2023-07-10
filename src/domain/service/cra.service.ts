import { CreateAbsenceDto } from "../../Dto/CreateAbsenceDto";
import { AbsenceDB } from "../../data/dataModel/absence.entity";
import { IRepoCollab } from "../IRepository/IRepoCollab";
import { IRepoCra } from "../IRepository/IRepoCra";
import { IRepoHoliday } from "../IRepository/IRepoHoliday";
import { Absence } from "../model/Absence";
import { CRA } from "../model/CRA";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CraService{
    constructor(@Inject('IRepoCollab') private readonly repoCollab:IRepoCollab,
    @Inject('IRepoCra') private readonly repoCra:IRepoCra,
    @Inject('IRepoHoliday') private readonly repoHoliday:IRepoHoliday){}

   async addAbsence(createAbsenceDto: CreateAbsenceDto){

        const dateAbs = new Date(createAbsenceDto.date);
        console.log("date"+dateAbs)
        //Test holiday
        const holidays = await this.repoHoliday.findByDate(dateAbs);
        if (holidays) {
            throw new Error('it is a holiday');
        }
        console.log("after holidays check");
        let craId: number = 0;
        let user=await this.repoCollab.findById(createAbsenceDto.collabId);
        
        // Check if the specified CRA exists
        let cra = (await this.repoCra.findByMonthYearCollab(dateAbs.getMonth()+1, dateAbs.getFullYear(), createAbsenceDto.collabId));
        if (!cra) {
            cra = new CRA(0,dateAbs.getMonth() + 1, dateAbs.getFullYear(), user, new Date());
            await this.repoCra.save(cra);
            console.log("created a new cra");
        }
        cra = (await this.repoCra.findByMonthYearCollab(dateAbs.getMonth()+1, dateAbs.getFullYear(), createAbsenceDto.collabId)) as CRA;
        console.log("cra here is "+cra)
        //create absence
        const absence = new Absence(0,user,createAbsenceDto.matin,createAbsenceDto.date,createAbsenceDto.raison,cra);
        console.log("created absence new")
       
        
/*
        // Test in the CRA for the same month and year
        if (absence.cra.month != dateAbs.getMonth() + 1 || absence.cra.year != dateAbs.getFullYear()) {
            throw new Error('Not in this CRA');
        }
        */

        console.log("absences in cra before adding = "+cra.absences.length)

        // Test if the day is already fully occupied or part of a fully occupied period
        if (cra.checkActivityOrAbsenceExists(dateAbs, createAbsenceDto.matin)) //cra
        {
            throw new Error('FULL day or period');
        }
        console.log("checked full day/period");

        

        // add absence to the cra
        cra.addAbsence(absence);
        console.log("absence added");
        //save cra and done
        this.repoCra.save(cra);
        console.log("cra added");

        return absence;
    }
}