import { Project } from '../../domain/model/Project';
import { ProjectDB } from '../dataModel/project.entity';
import { IRepoProject } from '../../domain/IRepository/IRepoProject';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { UserDB } from '../dataModel/user.entity';

@Injectable()
export class ProjectRepository implements IRepoProject {
  constructor(
    @InjectRepository(ProjectDB)
    private projectRepository: Repository<ProjectDB>,
  ) {}

  async findLikeById(id: string): Promise<Project[]> {
    const projectsDB = await this.projectRepository.find({
      where: { code: Like(id) },
      relations: ['collabs'],
    });
    return projectsDB.map((projectDB) => {
      const collabs: string[] = projectDB.collabs.map((collab) => collab.email);
      return new Project(
        projectDB.code,
        collabs,
        projectDB.name,
        projectDB.client,
        new Date(projectDB.date),
        projectDB.status,
      );
    });
  }

  async findById(id: string): Promise<Project> {
    console.log(id);
    const projectDB = await this.projectRepository.findOne({
      where: { code: id },
      relations: ['collabs'],
    });

    if (!projectDB) {
      throw new Error('Project not found');
    }

    const collabs: string[] = projectDB.collabs.map((collab) => collab.email);

    return new Project(
      projectDB.code,
      collabs,
      projectDB.name,
      projectDB.client,
      new Date(projectDB.date),
      projectDB.status,
    );
  }

  async findAll(): Promise<Project[]> {
    const projectsDB = await this.projectRepository.find({
      relations: ['collabs'],
    });

    return projectsDB.map((projectDB) => {
      const collabs: string[] = projectDB.collabs.map((collab) => collab.email);
      return new Project(
        projectDB.code,
        collabs,
        projectDB.name,
        projectDB.client,
        new Date(projectDB.date),
        projectDB.status,
      );
    });
  }

  async save(project: Project): Promise<Project> {
    const projectDB = new ProjectDB();
    projectDB.code = project.code;
    projectDB.name = project.name;
    projectDB.client = project.client;
    projectDB.date = new Date(project.date);
    projectDB.status = project.status;

    const collabs: UserDB[] = [];
    for (const email of project.collabs) {
      const collab = new UserDB();
      collab.email = email;
      collabs.push(collab);
    }
    projectDB.collabs = collabs;

    await this.projectRepository.save(projectDB);
    return project;
  }

  async delete(id: string): Promise<void> {
    await this.projectRepository.delete(id);
  }

  async update(updatedProject: Project): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { code: updatedProject.code },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    project.code = updatedProject.code;
    project.name = updatedProject.name;
    project.client = updatedProject.client;
    project.date = new Date(updatedProject.date);
    project.status = updatedProject.status;
    const collabs: UserDB[] = [];
    for (const email of updatedProject.collabs) {
      const collab = new UserDB();
      collab.email = email;
      collabs.push(collab);
    }
    project.collabs = collabs;

    const updatedProjectDB = await this.projectRepository.save(project);

    return new Project(
      updatedProjectDB.code,
      updatedProject.collabs,
      updatedProject.name,
      updatedProject.client,
      new Date(updatedProject.date),
      updatedProject.status,
    );
  }

  async findByUser(idUser: string): Promise<Project[]> {
    const projectsDB = await this.projectRepository.find({
      relations: ['collabs'],
    });

    const filteredProjects = projectsDB.filter((projectDB) =>
      projectDB.collabs.some((collab) => collab.email === idUser),
    );

    return filteredProjects.map((projectDB) => {
      const collabs: string[] = projectDB.collabs.map((collab) => collab.email);
      return new Project(
        projectDB.code,
        collabs,
        projectDB.name,
        projectDB.client,
        new Date(projectDB.date),
        projectDB.status,
      );
    });
  }
}
