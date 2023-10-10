import { Collab } from '@app/domain/model/Collab';
import { IRepoCollab } from '../IRepository/IRepoCollab';
import { Inject, Injectable } from '@nestjs/common';
import { Role } from '../model/Role';
import { IRepoProject } from '../IRepository/IRepoProject';
import { Project } from '../model/Project';
import { IRepoCra } from '../IRepository/IRepoCra';
import { CreateAbsenceDto } from '@app/dtos/CreateAbsenceDto';
import { CreateActivityDto } from '@app/dtos/CreateActivityDto';
import { Holiday } from '../model/Holiday';
import { IRepoHoliday } from '../IRepository/IRepoHoliday';
import { ProjectCode } from '@app/domain/model/project.code';
import { CollabEmail } from '@app/domain/model/collab.email';
import { Raison } from '@app/domain/model/Raison';
import { Absence } from '@app/domain/model/Absence';
import { CRA } from '@app/domain/model/CRA';
import { Etat } from '@app/domain/model/etat.enum';
import { Status } from '@app/domain/model/Status';
import { Activity } from '@app/domain/model/Activity';
import { ActivityDtoType, ProjectActivitiesDto } from '@app/dtos/activity.dto';

@Injectable()
export class CraApplication {
  constructor(
    @Inject('IRepoCollab') private collabRepository: IRepoCollab,
    @Inject('IRepoProject') private projectRepository: IRepoProject,
    @Inject('IRepoCra') private craRepository: IRepoCra,
    @Inject('IRepoHoliday') private holidayRepository: IRepoHoliday,
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

  async getProjectsByUser(id: CollabEmail) {
    return await this.projectRepository.findByUser(id);
  }

  async addAbsence(createAbsenceDto: CreateAbsenceDto) {
    const dateAbs = new Date(createAbsenceDto.date);

    const collabEmail = new CollabEmail(createAbsenceDto.collabId);

    // Check if the specified CRA exists
    let cra = await this.craRepository.findByMonthYearCollab(
      dateAbs.getMonth() + 1,
      dateAbs.getFullYear(),
      new CollabEmail(createAbsenceDto.collabId),
    );

    if (!cra) {
      cra = await this.createNewCra(dateAbs, collabEmail);
    }

    //create absence
    const absence = new Absence(
      createAbsenceDto.percentage,
      createAbsenceDto.date,
      createAbsenceDto.raison,
    );
    // add absence to the cra
    cra.addAbsence(absence);
    //save cra and done
    await this.craRepository.save(cra);

    return absence;
  }

  async deleteAbsence(idCra: string, date: Date, raison: Raison) {
    const cra = await this.craRepository.findById(idCra);
    cra.etat = Etat.unsubmitted;
    cra.deleteAbsence(date, raison);
    return await this.craRepository.save(cra);
  }

  async addActivity(createActivityDto: CreateActivityDto) {
    const dateAct = new Date(createActivityDto.date);

    const collabEmail = new CollabEmail(createActivityDto.collabId);

    const project = await this.projectRepository.findById(
      new ProjectCode(createActivityDto.projectId),
    );
    // Check if the specified CRA exists
    let cra = await this.craRepository.findByMonthYearCollab(
      dateAct.getMonth() + 1,
      dateAct.getFullYear(),
      new CollabEmail(createActivityDto.collabId),
    );

    if (!cra) {
      cra = await this.createNewCra(dateAct, collabEmail);
    }

    //create absence
    const activity = new Activity(
      project.code,
      createActivityDto.percentage,
      dateAct,
    );
    // add absence to the cra
    cra.addActivity(activity);
    //save cra and done
    await this.craRepository.save(cra);

    return activity;
  }

  async deleteActivity(idCra: string, date: Date, project: ProjectCode) {
    const cra = await this.craRepository.findById(idCra);
    cra.etat = Etat.unsubmitted;
    cra.deleteActivity(date, project);
    return await this.craRepository.save(cra);
  }

  async getCraByCollabMonthYear(
    idUser: CollabEmail,
    month: number,
    year: number,
  ) {
    return await this.craRepository.findByMonthYearCollab(month, year, idUser);
  }

  async bulkAdd(
    idUser: CollabEmail,
    month,
    year,
    activities: Array<ProjectActivitiesDto>,
  ) {
    const toAdd = new Array<Activity | Absence>();

    for (const projectActivity of activities) {
      for (const activityDto of projectActivity.activities) {
        if (activityDto.type === ActivityDtoType.project) {
          toAdd.push(
            new Activity(
              new ProjectCode(projectActivity.projectCode),
              activityDto.percentage,
              activityDto.date,
            ),
          );
        } else if (activityDto.type === ActivityDtoType.absence) {
          toAdd.push(
            new Absence(
              activityDto.percentage,
              activityDto.date,
              activityDto.reason,
            ),
          );
        }
      }
    }

    const craDate = new Date(year, month - 1, 1);
    let cra = await this.getCraByCollabMonthYear(
      idUser,
      craDate.getMonth() + 1,
      craDate.getFullYear(),
    );

    if (!cra) {
      cra = await this.createNewCra(craDate, idUser);
    }

    cra.bulkAdd(toAdd, { replace: true });
    await this.craRepository.save(cra);
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
    const cras = await this.craRepository.findByMonthYear(month, year);
    const crasUnsubmitted = cras.filter((cra) => cra.etat == Etat.unsubmitted);
    if (crasUnsubmitted.length > 0) {
      throw new Error('cannot close month: there is an unsubmitted cra');
    }
    cras.forEach((cra) => {
      cra.closeCra();
      this.craRepository.save(cra);
    });
  }

  async addCollab(collab: Collab): Promise<void> {
    await this.collabRepository.save(collab);
  }

  async desactivateProject(code: ProjectCode) {
    const project = await this.projectRepository.findById(code);
    project.desctivateProject();
    await this.projectRepository.save(project);
  }

  private async createNewCra(dateAct: Date, user: CollabEmail) {
    const collabPromise = await this.collabRepository.findById(user);

    if (collabPromise === undefined) {
      throw new Error(
        `Cannot create new CRA for an unknown collab ${user.value}`,
      );
    }

    const cra = new CRA(
      dateAct.getMonth() + 1,
      dateAct.getFullYear(),
      user,
      [],
      [],
      Etat.unsubmitted,
      Status.Open,
    );
    cra.holidays = await this.holidayRepository.findForCra(
      dateAct.getMonth() + 1,
      dateAct.getFullYear(),
    );
    await this.craRepository.save(cra);
    return await this.craRepository.findByMonthYearCollab(
      dateAct.getMonth() + 1,
      dateAct.getFullYear(),
      user,
    );
  }
}
