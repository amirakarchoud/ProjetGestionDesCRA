import { InjectRepository } from "@nestjs/typeorm";
import { Collab } from "../../domain/model/Collab";
import { IRepoCollab } from "../../domain/IRepoCollab";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CraApplication{
    constructor(@Inject('IRepoCollab') private collabRepository :IRepoCollab){}
    addUser(jwtToken:string){
        console.log("craqpp add user");
        const collab=new Collab('test1','test');
        console.log('collab'+collab.email);
        this.collabRepository.createUser(collab);

    }
}