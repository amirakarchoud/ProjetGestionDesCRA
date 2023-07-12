import { InjectRepository } from "@nestjs/typeorm";
import { Collab } from "../../domain/model/Collab";
import { IRepoCollab } from "../IRepository/IRepoCollab";
import { Inject, Injectable } from "@nestjs/common";
import { Role } from "../model/Role";
import { Absence } from "../model/Absence";
import { IRepoProject } from "../IRepository/IRepoProject";
import { Project } from "../model/Project";
import { IRepoCra } from "../IRepository/IRepoCra";
import { CraService } from "../service/cra.service";
import { CreateAbsenceDto } from "../../Dto/CreateAbsenceDto";
import { CreateActivityDto } from "@app/Dto/CreateActivityDto";

@Injectable()
export class CraApplication {
    constructor(@Inject('IRepoCollab') private collabRepository: IRepoCollab,
        @Inject('IRepoProject') private projectRepository: IRepoProject,
        @Inject('IRepoCra') private craRepository: IRepoCra,
        private readonly craService: CraService) { }

    async addUser(jwtToken: string) {
        console.log("craqpp add user");
        const collab = new Collab('test1', 'test', Role.admin);
        console.log('collab' + collab.email);
        await this.collabRepository.save(collab);

    }

    async addProject(project: Project) {
        return await this.projectRepository.save(project);
    }

    async getAllProjects() {
        return await this.projectRepository.findAll();
    }

    async updateProject(project: Project) {
        return await this.projectRepository.update(project);
    }

    async getProjectById(id: string) {
        return await this.projectRepository.findById(id);
    }

    async deleteProject(id: string) {
        return await this.projectRepository.delete(id);
    }

    async getProjectsByUser(id: string) {
        return await this.projectRepository.findByUser(id);
    }
    async addAbsence(absence: CreateAbsenceDto) {
        return await this.craService.addAbsence(absence);
    }

    async deleteAbsence(idCra: number, date: Date, matin: boolean) {
        return await this.craService.deleteAbsence(idCra, date, matin);
    }


    async addActivity(activity: CreateActivityDto) {
        return await this.craService.addActivity(activity);
    }

    async deleteActivity(idCra: number, date: Date, matin: boolean) {
        return await this.craService.deleteActivity(idCra, date, matin);
    }



}