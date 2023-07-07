import { Injectable } from "@nestjs/common";
import { Collab } from "../domain/model/Collab";
import { IRepoCollab } from "../domain/IRepoCollab";
import { Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { UserDB } from "./dataModel/user.entity";

@Injectable()
export class RepoCollab implements IRepoCollab {
  constructor(
    @InjectRepository(UserDB)
    private userRepository: Repository<UserDB>,
  ) {}

  async findAllUsers(): Promise<Collab[]> {
    return [];
  }

  async createUser(user: Collab): Promise<Collab> {
    const collab=new UserDB();
    console.log('here'+user.email);
    collab.email=user.email;
    collab.name=user.name;
    collab.role=user.role;
    this.userRepository.save(collab);

    return user;
  }
}