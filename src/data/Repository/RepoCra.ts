import { Repository } from "typeorm";
import { CRADB } from "../dataModel/cra.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { CRA } from "../../domain/model/CRA";
import { IRepoCra } from "../../domain/IRepository/IRepoCra";
import { RepoCollab } from "./RepoCollab";
import { IRepoCollab } from "../../domain/IRepository/IRepoCollab";
import { Etat } from "../../domain/model/etat.enum";

@Injectable()
export class RepoCra implements IRepoCra {
  constructor(
    @InjectRepository(CRADB)
    private craRepository: Repository<CRADB>,private readonly  collabRepository:RepoCollab
  ) { }


  async findByMonthYearCollab(month: number, year: number, collabid: string) {
    const cra = (await this.craRepository.findOne({ where: { month,year,collab:{email:collabid} },relations:['collab','activities', 'absences'] }));
    let user= await this.collabRepository.findById(cra.collab.email);
    return new CRA(cra.month, cra.year,user,cra.date);
  }


  async findById(id: number): Promise<CRA> {
    const cra = (await this.craRepository.findOne({ where: { id } ,relations:['collab','activities', 'absences']}));
    let user= await this.collabRepository.findById(cra.collab.email);
    return new CRA(cra.month, cra.year,user,cra.date);
  }

  async save(cra: CRA): Promise<CRA> {
    const cradb = new CRADB();
    cradb.month=cra.month;
    cradb.year=cra.year;
    const user=await this.collabRepository.findById(cra.collab.email);
    cradb.date=cra.date;
    cradb.etat=Etat.unsubmitted;

    return cra;
  }



}