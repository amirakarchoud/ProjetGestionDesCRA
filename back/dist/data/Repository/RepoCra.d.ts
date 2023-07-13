import { Repository } from "typeorm";
import { CRADB } from "../dataModel/cra.entity";
import { CRA } from "../../domain/model/CRA";
import { IRepoCra } from "../../domain/IRepository/IRepoCra";
import { IRepoCollab } from "../../domain/IRepository/IRepoCollab";
export declare class RepoCra implements IRepoCra {
    private craRepository;
    private readonly collabRepository;
    constructor(craRepository: Repository<CRADB>, collabRepository: IRepoCollab);
    findByMonthYearCollab(month: number, year: number, collabid: string): Promise<CRA>;
    findById(id: number): Promise<CRA>;
    save(cra: CRA): Promise<CRA>;
    findByCollab(collabid: string): Promise<CRA[]>;
}
