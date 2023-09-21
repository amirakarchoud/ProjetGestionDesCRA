import { Collab } from '@app/domain/model/Collab';
import { CollabEmail } from '@app/domain/model/collab.email';

export interface IRepoCollab {
  findAll(): Promise<Collab[]>;

  save(user: Collab): Promise<void>;

  findById(id: CollabEmail): Promise<Collab>;

  //addProject(project:Project):Promise<Project>;
  findByIds(ids: CollabEmail[]): Promise<Collab[]>;
}
