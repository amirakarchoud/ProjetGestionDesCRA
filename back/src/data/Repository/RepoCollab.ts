import { Injectable } from "@nestjs/common";
import { Collab } from "../../domain/model/Collab";
import { IRepoCollab } from "../../domain/IRepository/IRepoCollab";
import { In, Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { UserDB } from "../dataModel/user.entity";
import { Role } from "../../domain/model/Role";
import { Project } from "../../domain/model/Project";
import { classToPlain } from "class-transformer";
import { ProjectDB } from "../dataModel/project.entity";
import { ActivityDB } from "../dataModel/activity.entity";

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
    await this.userRepository.save(collab);

    return user;
  }

/*
  async addProject(project: Project): Promise<Project> {
    for (const user of project.collabs) {
      user.addProject(project);
      const collab = new UserDB();
      console.log('add project for = ' + user.email);
      collab.email = user.email;
      collab.name = user.name;
      collab.role = user.role;
      collab.projects = user.projects as ProjectDB[];
      collab.activities = user.activities as ActivityDB[];
      console.log("length "+collab.projects.length);
      console.log("code "+collab.projects[0].code);
      await this.userRepository.save(collab);
    }
    return project;
  }
  */
  
  


  async findByIds(ids: string[]): Promise<Collab[]> {
    let collabs: Collab[]=[];
    const users= (await this.userRepository.findBy({email:In(ids)})).map(user => { collabs.push(new Collab(user.email, user.name, user.role)) });;
    if (users) {
      return collabs;
    }
  
    return null;
  }
}