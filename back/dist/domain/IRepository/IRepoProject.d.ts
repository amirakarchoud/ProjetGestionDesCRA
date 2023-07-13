import { Project } from "../model/Project";
export interface IRepoProject {
    findAll(): Promise<Project[]>;
    save(project: Project): Promise<Project>;
    findById(id: string): Promise<Project>;
    delete(id: string): Promise<void>;
    update(updatedProject: Project): Promise<Project>;
    findByUser(idUser: string): Promise<Project[]>;
}
