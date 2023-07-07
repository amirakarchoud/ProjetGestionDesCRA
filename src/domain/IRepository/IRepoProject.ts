import { Project } from "../model/Project";

export interface IRepoProject {
    findAll(): Promise<Project[]>;
    save(project: Project): Promise<Project>;
  }