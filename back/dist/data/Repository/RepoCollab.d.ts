import { Collab } from "../../domain/model/Collab";
import { IRepoCollab } from "../../domain/IRepository/IRepoCollab";
import { Repository } from "typeorm";
import { UserDB } from "../dataModel/user.entity";
export declare class RepoCollab implements IRepoCollab {
    private userRepository;
    constructor(userRepository: Repository<UserDB>);
    findById(id: string): Promise<Collab>;
    findAll(): Promise<Collab[]>;
    save(user: Collab): Promise<Collab>;
    findByIds(ids: string[]): Promise<Collab[]>;
}
