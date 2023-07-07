import { InjectRepository } from "@nestjs/typeorm";
import { Collab } from "../../domain/model/Collab";
import { IRepoCollab } from "../IRepository/IRepoCollab";
import { Inject, Injectable } from "@nestjs/common";
import { Role } from "../model/Role";
import { IRepoAbsence } from "../IRepository/IRepoAbsence";
import { Absence } from "../model/Absence";

@Injectable()
export class CraApplication{
    constructor(@Inject('IRepoCollab') private collabRepository :IRepoCollab
    ,@Inject('IRepoAbsence') private absenceRepository :IRepoAbsence){}

    addUser(jwtToken:string){
        console.log("craqpp add user");
        const collab=new Collab('test1','test',Role.admin);
        console.log('collab'+collab.email);
        this.collabRepository.save(collab);

    }

    addAbsence(
        //absenceDTO??
    ){
       // const user=this.collabRepository.findById(absDto.collab);
    // const absence=new Absence(user,absDto.matin,absDto.date,absDto.raison,)
    }

    
}