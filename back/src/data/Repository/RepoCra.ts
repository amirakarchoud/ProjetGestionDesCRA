import { Repository } from "typeorm";
import { CRADB } from "../dataModel/cra.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { CRA } from "../../domain/model/CRA";
import { IRepoCra } from "../../domain/IRepository/IRepoCra";
import { RepoCollab } from "./RepoCollab";
import { IRepoCollab } from "../../domain/IRepository/IRepoCollab";
import { UserDB } from "../dataModel/user.entity";
import { AbsenceDB } from "../dataModel/absence.entity";
import { ActivityDB } from "../dataModel/activity.entity";
import { Absence } from "../../domain/model/Absence";
import { Collab } from "../../domain/model/Collab";
import { Activity } from "../../domain/model/Activity";
import { Project } from "../../domain/model/Project";
import { HolidayDB } from "../dataModel/holiday.entity";
import { Holiday } from "../../domain/model/Holiday";
import { ProjectDB } from "../dataModel/project.entity";

@Injectable()
export class RepoCra implements IRepoCra {
  constructor(
    @InjectRepository(CRADB)
    private craRepository: Repository<CRADB>, @Inject('IRepoCollab') private readonly collabRepository: IRepoCollab
  ) { }
  async findByYearUser(collabid: string, year: number): Promise<CRA[]> {
    
    let foundcras: CRA[] = [];

    const cras = (await this.craRepository.find({ where: { collab: { email: collabid },year }, relations: ['collab', 'activities', 'absences', 'holidays','activities.project'] }));
    let user = await this.collabRepository.findById(collabid);
    if (cras) {
      cras.forEach(cra => {

        let foundcra = new CRA(cra.id, cra.month, cra.year, user, cra.date, cra.etat);
        foundcra.collab.email = user.email;
        //fill absences

        const craAbsences: Absence[] = cra.absences.map((abs) => {
          const absf = new Absence(foundcra.id,
            abs.matin, abs.date, abs.raison);
          return absf;
        });
        foundcra.absences = craAbsences;
        //fill activities
        //
        const craAact: Activity[] = cra.activities.map((abs) => {
          const absf = new Activity(abs.id, new Collab(cra.collab.email, cra.collab.name, cra.collab.role), new Project(abs.project.code, []),
            abs.matin, abs.date, foundcra);
          return absf;
        });
        foundcra.activities = craAact;

        const craholiday: Holiday[] = cra.holidays.map((abs) => {
          const absf = new Holiday(abs.id, abs.date, abs.name);
          return absf;
        });
        foundcra.holidays = craholiday;
        foundcras.push(foundcra);

      });



    }
    return foundcras;
  }


  async findByMonthYearCollab(month: number, year: number, collabid: string) {

    const cra = (await this.craRepository.findOne({ where: { month, year, collab: { email: collabid } }, relations: ['collab', 'activities', 'absences', 'holidays', 'activities.project'] }));
    if (cra) {
      let user = await this.collabRepository.findById(cra.collab.email);

      let foundcra = new CRA(cra.id, cra.month, cra.year, user, cra.date, cra.etat);
      foundcra.collab.email = user.email;
      //fill absences

      const craAbsences: Absence[] = cra.absences.map((abs) => {
        const absf = new Absence(foundcra.id,
          abs.matin, abs.date, abs.raison);
        return absf;
      });
      foundcra.absences = craAbsences;
      //fill activities
      //
      const craAact: Activity[] = cra.activities.map((abs) => {
        const absf = new Activity(abs.id, new Collab(cra.collab.email, cra.collab.name, cra.collab.role), new Project(abs.project.code, []),
          abs.matin, abs.date, foundcra);
        return absf;
      });
      foundcra.activities = craAact;

      const craholiday: Holiday[] = cra.holidays.map((abs) => {
        const absf = new Holiday(abs.id, abs.date, abs.name);
        return absf;
      });
      foundcra.holidays = craholiday;
      return foundcra;
    }
    return null;
  }


  async findById(id: number): Promise<CRA> {
    const cra = (await this.craRepository.findOne({ where: { id }, relations: ['collab', 'activities', 'absences', 'activities.project', 'holidays'] }));
    let user = await this.collabRepository.findById(cra.collab.email);
    let found = new CRA(cra.id, cra.month, cra.year, user, cra.date, cra.etat);

    //fill 

    const craAbsences: Absence[] = cra.absences.map((abs) => {
      const absf = new Absence(found.id,
        abs.matin, abs.date, abs.raison);
      return absf;
    });
    found.absences = craAbsences;

    //fill activities
    //
    const craAact: Activity[] = cra.activities.map((abs) => {
      const absf = new Activity(abs.id, new Collab(cra.collab.email, cra.collab.name, cra.collab.role), new Project(abs.project.code, []),
        abs.matin, abs.date, found);
      return absf;
    });
    found.activities = craAact;

    const craholiday: Holiday[] = cra.holidays.map((abs) => {
      const absf = new Holiday(abs.id, abs.date, abs.name);
      return absf;
    });
    found.holidays = craholiday;

    return found;

  }

  async save(cra: CRA): Promise<CRA> {
    const cradb = new CRADB();
    cradb.id = cra.id;
    cradb.month = cra.month;
    cradb.year = cra.year;
    cradb.collab = new UserDB();
    cradb.collab.email = cra.collab.email;
    cradb.date = cra.date;
    cradb.etat = cra.etat;
    const craActivitiesDB: ActivityDB[] = cra.activities.map((activity) => {
      const activityDB = new ActivityDB();
      activityDB.cra = new CRADB();
      activityDB.cra.id = cra.id;
      activityDB.id = activity.id;
      activityDB.date = activity.date;
      activityDB.collab = new UserDB();
      activityDB.collab.email = cra.collab.email;
      activityDB.matin = activity.matin;
      activityDB.project = new ProjectDB();
      activityDB.project.code = activity.project.code;

      return activityDB;
    });
    cradb.activities = craActivitiesDB;

    const craAbsencesDB: AbsenceDB[] = cra.absences.map((abs) => {
      const absdb = new AbsenceDB();
      absdb.id = abs.id;
      absdb.cra = new CRADB();
      absdb.cra.id = cra.id;
      absdb.date = abs.date;
      absdb.matin = abs.matin;
      absdb.collab = new UserDB();
      absdb.collab.email = cra.collab.email;
      absdb.raison = abs.raison;
      return absdb;
    });
    cradb.absences = craAbsencesDB;

    const holidaydb: HolidayDB[] = cra.holidays.map((hol) => {
      const holdb = new HolidayDB();
      holdb.id = hol.id;
      holdb.date = hol.date;
      holdb.name = hol.name;
      return holdb;
    });
    cradb.holidays = holidaydb;
    await this.craRepository.save(cradb);

    return cra;
  }





  async findByCollab(collabid: string) {
    let foundcras: CRA[] = [];

    const cras = (await this.craRepository.find({ where: { collab: { email: collabid } }, relations: ['collab', 'activities', 'absences', 'holidays'] }));
    let user = await this.collabRepository.findById(collabid);
    if (cras) {
      cras.forEach(cra => {

        let foundcra = new CRA(cra.id, cra.month, cra.year, user, cra.date, cra.etat);
        foundcra.collab.email = user.email;
        //fill absences

        const craAbsences: Absence[] = cra.absences.map((abs) => {
          const absf = new Absence(foundcra.id,
            abs.matin, abs.date, abs.raison);
          return absf;
        });
        foundcra.absences = craAbsences;
        //fill activities
        //
        const craAact: Activity[] = cra.activities.map((abs) => {
          const absf = new Activity(abs.id, new Collab(cra.collab.email, cra.collab.name, cra.collab.role), new Project(abs.project.code, []),
            abs.matin, abs.date, foundcra);
          return absf;
        });
        foundcra.activities = craAact;

        const craholiday: Holiday[] = cra.holidays.map((abs) => {
          const absf = new Holiday(abs.id, abs.date, abs.name);
          return absf;
        });
        foundcra.holidays = craholiday;
        foundcras.push(foundcra);

      });



    }
    return foundcras;
  }




}