import { IRepoAbsence } from "../../domain/IRepository/IRepoAbsence";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AbsenceDB } from "../dataModel/absence.entity";
import { Absence } from "../../domain/model/Absence";
import { UserDB } from "../dataModel/user.entity";
import { RepoCollab } from "./RepoCollab";
import { RepoCra } from "./RepoCra";
import { IRepoHoliday } from "../../domain/IRepository/IRepoHoliday";
import { CRA } from "../../domain/model/CRA";
import { RepoHoliday } from "./RepoHoliday";

@Injectable()
export class RepoAbsence implements IRepoAbsence {
    constructor(
        @InjectRepository(AbsenceDB)
        private absenceRepository: Repository<AbsenceDB>, private readonly repoCollab: RepoCollab, private readonly repoCra: RepoCra
        , private readonly repoHoliday: RepoHoliday
    ) { }

    async findAll(): Promise<Absence[]> {
        let absences: Absence[];
        (await this.absenceRepository.find()).map(async abs => {
            let user = await this.repoCollab.findById(abs.collab.email);
            let cra = await this.repoCra.findById(abs.cra.id);
            absences.push(new Absence(user, abs.matin, abs.date, abs.raison, cra));
        });
        return absences;

    }


    async save(absence: Absence): Promise<Absence> {
        const absencedb = new AbsenceDB();

        const dateAbs = new Date(absence.date);
        //Test holiday
        const holidays = await this.repoHoliday.findByDate(dateAbs);
        if (holidays) {
            throw new Error('it is a holiday');
        }
        let craId: number = 0;

        // Check if the specified CRA exists
        let cra = (await this.repoCra.findByMonthYearCollab(dateAbs.getMonth(), dateAbs.getFullYear(), absence.collab.email));
        if (!cra) {
            cra = new CRA(dateAbs.getMonth() + 1, dateAbs.getFullYear(), absence.collab, new Date());
            await this.repoCra.save(cra);
        }

        //create absence
        absencedb.date = absence.date;
        absencedb.matin = absence.matin;
        absencedb.raison = absence.raison;
        // absencedb.collab=absence.collab;
        let user=await this.repoCollab.findById(absence.collab.email);
       // absencedb.collab=user;

        // Test in the CRA for the same month and year
        if (absence.cra.month != dateAbs.getMonth() + 1 || absence.cra.year != dateAbs.getFullYear()) {
            throw new Error('Not in this CRA');
        }


        // Test if the day is already fully occupied or part of a fully occupied period
        if (cra.checkActivityOrAbsenceExists(dateAbs, absence.matin)) //cra
        {
            throw new Error('FULL day or period');
        }

        //save and done
        this.absenceRepository.save(absencedb);

        return absence;
    }




  async findById(id: number): Promise<Absence> {
    const absence = (await this.absenceRepository.findOne({ where: { id } ,relations:['collab','cra']}));
    let user= await this.repoCollab.findById(absence.collab.email);
    let cra = await this.repoCra.findById(absence.cra.id);
    return new Absence(user,absence.matin,absence.date,absence.raison,cra);
  }

  async delete(id: number) {
      await this.absenceRepository.delete(id);
  }
}