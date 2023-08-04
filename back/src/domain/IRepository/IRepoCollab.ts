import { Collab } from '../model/Collab';

export interface IRepoCollab {
  findAll(): Promise<Collab[]>;
  save(user: Collab): Promise<Collab>;
  findById(id: string): Promise<Collab>;
  //addProject(project:Project):Promise<Project>;
  findByIds(ids: string[]): Promise<Collab[]>;
}
