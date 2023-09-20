import { Project } from '@app/domain/model/Project';
import { ProjectCode } from '@app/domain/model/project.code';

export interface IRepoProject {
  findAll(): Promise<Project[]>;
  save(project: Project): Promise<void>;
  findById(id: ProjectCode): Promise<Project>;
  delete(id: ProjectCode): Promise<void>;
  update(updatedProject: Project): Promise<void>;
  findByUser(idUser: string): Promise<Project[]>;
  findLikeById(id: ProjectCode): Promise<Project[]>;
}
