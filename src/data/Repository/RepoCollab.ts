import { Injectable } from "@nestjs/common";
import { Collab } from "../../domain/model/Collab";
import { IRepoCollab } from "../../domain/IRepository/IRepoCollab";
import { Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { UserDB } from "../dataModel/user.entity";
import { Role } from "@app/domain/model/Role";

@Injectable()
export class RepoCollab implements IRepoCollab {
  constructor(
    @InjectRepository(UserDB)
    private userRepository: Repository<UserDB>,
  ) { }

  
  async findById(id: string): Promise<Collab> {
    const user= (await this.userRepository.findOne({where:{email:id}}));
    return new Collab(user.email,user.name,user.role);
  }

  async findAll(): Promise<Collab[]> {
    let collabs: Collab[];
    (await this.userRepository.find()).map(user => { collabs.push(new Collab(user.email, user.name, user.role)) });
    return collabs;

  }

  async save(user: Collab): Promise<Collab> {
    const collab = new UserDB();
    console.log('here' + user.email);
    collab.email = user.email;
    collab.name = user.name;
    collab.role = user.role;
    console.log('role ' + (user.role as Role));
    this.userRepository.save(collab);

    return user;
  }
}