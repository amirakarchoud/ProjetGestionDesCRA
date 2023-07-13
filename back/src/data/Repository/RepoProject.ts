import { Project } from "../../domain/model/Project";
import { ProjectDB } from "../dataModel/project.entity";
import { IRepoProject } from "../../domain/IRepository/IRepoProject";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserDB } from "../dataModel/user.entity";

@Injectable()
export class RepoProject implements IRepoProject {
  constructor(
    @InjectRepository(ProjectDB)
    private projectRepository: Repository<ProjectDB>,
  ) { }
   

  
  async findById(id: string): Promise<Project> {
    const projectDB = await this.projectRepository.findOne({
      where: { code: id },
      relations: ['collabs'],
    });
  
    if (!projectDB) {
      throw new Error('Project not found');
    }
  
    const collabs: string[] = projectDB.collabs.map((collab) => collab.email);
  
    return new Project(projectDB.code, collabs);
  }
  
  async findAll(): Promise<Project[]> {
    const projectsDB = await this.projectRepository.find({ relations: ['collabs'] });
  
    return projectsDB.map((projectDB) => {
      const collabs: string[] = projectDB.collabs.map((collab) => collab.email);
      return new Project(projectDB.code, collabs);
    });
  }
  
  async save(project: Project): Promise<Project> {
    const projectDB = new ProjectDB();
    projectDB.code = project.code;
  
    const collabs: UserDB[] = [];
    for (const email of project.collabs) {
      const collab = new UserDB();
      collab.email = email;
      collabs.push(collab);
    }
    projectDB.collabs = collabs;
  
    const savedProject = await this.projectRepository.save(projectDB);
  
    const savedCollabs: string[] = savedProject.collabs.map((collab) => collab.email);
    //return new Project(savedProject.code, savedCollabs);
    return project;
  }

  async delete(id: string): Promise<void> {
    await this.projectRepository.delete(id);
  }


  async update( updatedProject: Project): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { code: updatedProject.code } });
  
    if (!project) {
      throw new Error('Project not found');
    }
  
    project.code = updatedProject.code;
    const collabs: UserDB[] = [];
    for (const email of updatedProject.collabs) {
      const collab = new UserDB();
      collab.email = email;
      collabs.push(collab);
    }
    project.collabs = collabs;
  
    const updatedProjectDB = await this.projectRepository.save(project);
  
    return new Project(updatedProjectDB.code, updatedProject.collabs);
  }

  async findByUser(idUser: string): Promise<Project[]> {
    const projectsDB = await this.projectRepository.find({ relations: ['collabs'] });
  
    const filteredProjects = projectsDB.filter((projectDB) =>
      projectDB.collabs.some((collab) => collab.email === idUser)
    );
  
    return filteredProjects.map((projectDB) => {
      const collabs: string[] = projectDB.collabs.map((collab) => collab.email);
      return new Project(projectDB.code, collabs);
    });
  }
  
  
  
  

  
}