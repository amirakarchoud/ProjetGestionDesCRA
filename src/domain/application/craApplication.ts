import { InjectRepository } from "@nestjs/typeorm";
import { Collab } from "../../domain/model/Collab";
import { IRepoCollab } from "../IRepository/IRepoCollab";
import { Inject, Injectable } from "@nestjs/common";
import { Role } from "../model/Role";

@Injectable()
export class CraApplication{
    constructor(@Inject('IRepoCollab') private collabRepository :IRepoCollab){}
    addUser(jwtToken:string){
        console.log("craqpp add user");
        const collab=new Collab('test1','test',Role.admin);
        console.log('collab'+collab.email);
        this.collabRepository.save(collab);

    }
}