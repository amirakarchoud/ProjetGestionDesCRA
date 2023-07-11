import { Repository } from "typeorm";
import { CRADB } from "../dataModel/cra.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { CRA } from "../../domain/model/CRA";
import { IRepoCra } from "../../domain/IRepository/IRepoCra";
import { RepoCollab } from "./RepoCollab";
import { IRepoCollab } from "../../domain/IRepository/IRepoCollab";
import { Etat } from "../../domain/model/etat.enum";
import { UserDB } from "../dataModel/user.entity";
import { AbsenceDB } from "../dataModel/absence.entity";
import { classToPlain, plainToClass } from "class-transformer";
import { ActivityDB } from "../dataModel/activity.entity";
import { Absence } from "../../domain/model/Absence";
import { Collab } from "../../domain/model/Collab";
import { Activity } from "../../domain/model/Activity";
import { Project } from "../../domain/model/Project";
import { HolidayDB } from "../dataModel/holiday.entity";
import { Holiday } from "../../domain/model/Holiday";

@Injectable()
export class RepoCra implements IRepoCra {
  constructor(
    @InjectRepository(CRADB)
    private craRepository: Repository<CRADB>,@Inject('IRepoCollab') private readonly collabRepository:IRepoCollab
  ) { }


  async findByMonthYearCollab(month: number, year: number, collabid: string) {
 
    const cra = (await this.craRepository.findOne({ where: { month,year,collab:{email:collabid} },relations:['collab','activities', 'absences','holidays'] }));
    if (cra){
    let user= await this.collabRepository.findById(cra.collab.email);
    console.log("holidays here22 "+cra.holidays.length)
    
    let foundcra=new CRA(cra.id,cra.month, cra.year,user,cra.date);
    foundcra.collab.email=user.email;
    console.log("holidays here33 "+foundcra.holidays.length)
    //fill absences

    const craAbsences: Absence[] = cra.absences.map( (abs) => {
      const absf = new Absence(foundcra.id,
      abs.matin,abs.date,abs.raison);
      return absf;
    });
    foundcra.absences=craAbsences;
//fill activities
//
    const craAact: Activity[] = cra.activities.map( (abs) => {
      const absf = new Activity(abs.id,new Collab(cra.collab.email,cra.collab.name,cra.collab.role),new Project(abs.project.code,[]),
      abs.matin,abs.date,foundcra);
      return absf;
    });
    foundcra.activities=craAact;

    const craholiday: Holiday[] = cra.holidays.map( (abs) => {
      const absf = new Holiday(abs.id,abs.date,abs.name);
      return absf;
    });
    foundcra.holidays=craholiday;
    console.log("holidays here44 "+foundcra.holidays.length)
    return foundcra;
    }
    return null;
  }


  async findById(id: number): Promise<CRA> {
    const cra = (await this.craRepository.findOne({ where: { id } ,relations:['collab','activities', 'absences']}));
    let user= await this.collabRepository.findById(cra.collab.email);
    let found= new CRA(cra.id,cra.month, cra.year,user,cra.date);

    //fill 

    const craAbsences: Absence[] = cra.absences.map( (abs) => {
      const absf = new Absence(found.id,
      abs.matin,abs.date,abs.raison);
      return absf;
    });
    found.absences=craAbsences;

    return found;
    
  }

  async save(cra: CRA): Promise<CRA> {
    const cradb = new CRADB();
    console.log("id in save= "+cra.id)
    cradb.id=cra.id;
    cradb.month=cra.month;
    cradb.year=cra.year;
    cradb.collab=new UserDB();
    cradb.collab.email=cra.collab.email;
   console.log("save= "+cra.date);
    cradb.date=cra.date;
    cradb.etat=Etat.unsubmitted;
    const craActivitiesDB: ActivityDB[] = cra.activities.map((activity) => {
      const activityDB = new ActivityDB();
      activityDB.cra=new CRADB();
      activityDB.cra.id=cra.id;
      activityDB.id = activity.id;
      activityDB.date=activity.date;
      activityDB.collab=new UserDB();
      activityDB.collab.email=activity.collab.email;
      activityDB.matin=activity.matin;

      return activityDB;
    });
    cradb.activities = craActivitiesDB;

    const craAbsencesDB: AbsenceDB[] = cra.absences.map( (abs) => {
      const absdb = new AbsenceDB();
      absdb.id = abs.id;
      absdb.cra=new CRADB();
      absdb.cra.id=cra.id;
      absdb.date=abs.date;
      absdb.matin=abs.matin;
      absdb.collab=new UserDB();
      absdb.collab.email=cra.collab.email;
      absdb.raison=abs.raison;
      return absdb;
    });
    cradb.absences = craAbsencesDB;

    console.log("holidays= "+cra.holidays.length);

    const holidaydb: HolidayDB[] = cra.holidays.map( (hol) => {
      const holdb=new HolidayDB();
      holdb.id=hol.id;
      holdb.date=hol.date;
      holdb.name=hol.name;
      return holdb;
    });
    cradb.holidays=holidaydb;
    console.log("holidays in save here55 "+cra.holidays.length)
    console.log("holidays in save here66 "+cradb.holidays.length)
    await this.craRepository.save(cradb);

    return cra;
  }



}