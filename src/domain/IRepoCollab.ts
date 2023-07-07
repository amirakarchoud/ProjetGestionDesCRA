import { Collab } from "./model/Collab";

export interface IRepoCollab {
  findAllUsers(): Promise<Collab[]>;
  createUser(user: Collab): Promise<Collab>;
}