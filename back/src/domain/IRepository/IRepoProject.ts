import { Project } from '@app/domain/model/Project';

export interface IRepoProject {
  findAll(): Promise<Project[]>;
  save(project: Project): Promise<void>;
  findById(id: string): Promise<Project>;
  delete(id: string): Promise<void>;
  update(updatedProject: Project): Promise<void>;
  findByUser(idUser: string): Promise<Project[]>;
  findLikeById(id: string): Promise<Project[]>;
}
