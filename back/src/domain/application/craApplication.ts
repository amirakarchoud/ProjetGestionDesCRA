import { Collab } from '@app/domain/model/Collab';
import { IRepoCollab } from '../IRepository/IRepoCollab';
import { Inject, Injectable } from '@nestjs/common';
import { Role } from '../model/Role';
import { IRepoProject } from '../IRepository/IRepoProject';
import { Project } from '../model/Project';
import { IRepoCra } from '../IRepository/IRepoCra';
import { CraService } from '../service/cra.service';
import { CreateAbsenceDto } from '@app/dtos/CreateAbsenceDto';
import { CreateActivityDto } from '@app/dtos/CreateActivityDto';
import { Holiday } from '../model/Holiday';
import { IRepoHoliday } from '../IRepository/IRepoHoliday';
import { ProjectCode } from '@app/domain/model/project.code';
import { CollabEmail } from '@app/domain/model/collab.email';

@Injectable()
export class CraApplication {
  constructor(
    @Inject('IRepoCollab') private collabRepository: IRepoCollab,
    @Inject('IRepoProject') private projectRepository: IRepoProject,
    @Inject('IRepoCra') private craRepository: IRepoCra,
    @Inject('IRepoHoliday') private holidayRepository: IRepoHoliday,
    private readonly craService: CraService,
  ) {}

  async getAllHolidays(): Promise<Holiday[]> {
    return await this.holidayRepository.findAll();
  }

  async addUser(jwtToken: string) {
    console.log('craqpp add user');
    const collab = new Collab(
      new CollabEmail('test1@proxym.fr'),
      'test',
      'last name test',
      Role.admin,
    );
    collab.password = '123';
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
    await this.projectRepository.update(project);
  }

  async getProjectById(id: ProjectCode) {
    return await this.projectRepository.findById(id);
  }

  async deleteProject(id: ProjectCode) {
    return await this.projectRepository.delete(id);
  }

  async getProjectsByUser(id: string) {
    return await this.projectRepository.findByUser(id);
  }
  async addAbsence(absence: CreateAbsenceDto) {
    return await this.craService.addAbsence(absence);
  }

  async deleteAbsence(idCra: string, date: Date, matin: boolean) {
    return await this.craService.deleteAbsence(idCra, date, matin);
  }

  async addActivity(activity: CreateActivityDto) {
    return await this.craService.addActivity(activity);
  }

  async deleteActivity(idCra: string, date: Date, matin: boolean) {
    return await this.craService.deleteActivity(idCra, date, matin);
  }

  async getCraByCollabMonthYear(idUser: CollabEmail, month: number, year: number) {
    return await this.craRepository.findByMonthYearCollab(month, year, idUser);
  }

  async submitCra(idCra: string) {
    const cra = await this.craRepository.findById(idCra);
    cra.SubmitCra();
    return await this.craRepository.save(cra);
  }

  async getEmptyDates(idCra: string) {
    const cra = await this.craRepository.findById(idCra);
    return cra.getAvailableDatesOfCra();
  }

  async userYearCra(idUser: CollabEmail, year: number) {
    return await this.craRepository.findByYearUser(idUser, year);
  }

  async getAllCollabs() {
    return await this.collabRepository.findAll();
  }

  async getAllCollabsByIds(ids: CollabEmail[]) {
    return await this.collabRepository.findByIds(ids);
  }

  async getProjectsLikeId(id: ProjectCode) {
    return await this.projectRepository.findLikeById(id);
  }

  async getMonthCra(month: number, year: number) {
    return await this.craRepository.findByMonthYear(month, year);
  }

  async closeAllMonthCra(month: number, year: number) {
    return await this.craService.closeAllMonthCra(month, year);
  }

  async addCollab(collab: Collab): Promise<void> {
    await this.collabRepository.save(collab);
  }

  async desactivateProject(code: ProjectCode) {
    const project = await this.projectRepository.findById(code);
    project.desctivateProject();
    await this.projectRepository.save(project);
  }
}
