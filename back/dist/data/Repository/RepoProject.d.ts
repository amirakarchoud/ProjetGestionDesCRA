import { Project } from "../../domain/model/Project";
import { ProjectDB } from "../dataModel/project.entity";
import { IRepoProject } from "../../domain/IRepository/IRepoProject";
import { Repository } from "typeorm";
export declare class RepoProject implements IRepoProject {
    private projectRepository;
    constructor(projectRepository: Repository<ProjectDB>);
    findById(id: string): Promise<Project>;
    findAll(): Promise<Project[]>;
    save(project: Project): Promise<Project>;
    delete(id: string): Promise<void>;
    update(updatedProject: Project): Promise<Project>;
    findByUser(idUser: string): Promise<Project[]>;
}
