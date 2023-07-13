import { CreateAbsenceDto } from "../../Dto/CreateAbsenceDto";
import { IRepoCollab } from "../IRepository/IRepoCollab";
import { IRepoCra } from "../IRepository/IRepoCra";
import { IRepoHoliday } from "../IRepository/IRepoHoliday";
import { Absence } from "../model/Absence";
import { CRA } from "../model/CRA";
import { CreateActivityDto } from "../../Dto/CreateActivityDto";
import { Activity } from "../model/Activity";
import { IRepoProject } from "../IRepository/IRepoProject";
export declare class CraService {
    private readonly repoCollab;
    private readonly repoCra;
    private readonly repoProject;
    private readonly repoHoliday;
    constructor(repoCollab: IRepoCollab, repoCra: IRepoCra, repoProject: IRepoProject, repoHoliday: IRepoHoliday);
    deleteAbsence(id: number, date: Date, matin: boolean): Promise<CRA>;
    addAbsence(createAbsenceDto: CreateAbsenceDto): Promise<Absence>;
    deleteActivity(id: number, date: Date, matin: boolean): Promise<CRA>;
    addActivity(createActivityDto: CreateActivityDto): Promise<Activity>;
}
