import { Project } from '@app/domain/model/Project';
import { ProjectCode } from '@app/domain/model/project.code';
import { CollabEmail } from '@app/domain/model/collab.email';

export interface IRepoProject {
  findAll(): Promise<Project[]>;
  save(project: Project): Promise<void>;
  findById(id: ProjectCode): Promise<Project>;
  delete(id: ProjectCode): Promise<void>;
  update(updatedProject: Project): Promise<void>;
  findByUser(idUser: CollabEmail): Promise<Project[]>;
  findLikeById(id: ProjectCode): Promise<Project[]>;
}
