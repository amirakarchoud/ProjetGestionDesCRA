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

    async deleteAbsence(id:number,date:Date,matin:boolean){
        const cra=await this.repoCra.findById(id);
        cra.deleteAbsence(date,matin);
       return await this.repoCra.save(cra);
    }

   async addAbsence(createAbsenceDto: CreateAbsenceDto){

        const dateAbs = new Date(createAbsenceDto.date);
        let user=await this.repoCollab.findById(createAbsenceDto.collabId);
        // Check if the specified CRA exists
        let cra = (await this.repoCra.findByMonthYearCollab(dateAbs.getMonth()+1, dateAbs.getFullYear(), createAbsenceDto.collabId));
        if (!cra) {
            cra = new CRA(0,dateAbs.getMonth() + 1, dateAbs.getFullYear(), user, new Date());
            cra.holidays=await this.repoHoliday.findForCra(dateAbs.getMonth() + 1, dateAbs.getFullYear());
            await this.repoCra.save(cra);
        }
        cra = (await this.repoCra.findByMonthYearCollab(dateAbs.getMonth()+1, dateAbs.getFullYear(), createAbsenceDto.collabId)) as CRA;
        console.log("holidays here11 "+cra.holidays.length)
        //create absence
        const absence = new Absence(cra.id,createAbsenceDto.matin,createAbsenceDto.date,createAbsenceDto.raison);
       
        // add absence to the cra
        cra.addAbsence(absence);
        //save cra and done
        this.repoCra.save(cra);

        return absence;
    }
}