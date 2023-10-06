import { CreateAbsenceDto } from '@app/dtos/CreateAbsenceDto';
import { IRepoCollab } from '../IRepository/IRepoCollab';
import { IRepoCra } from '../IRepository/IRepoCra';
import { IRepoHoliday } from '../IRepository/IRepoHoliday';
import { Absence } from '../model/Absence';
import { CRA } from '../model/CRA';
import { Inject, Injectable } from '@nestjs/common';
import { Etat } from '../model/etat.enum';
import { CreateActivityDto } from '@app/dtos/CreateActivityDto';
import { Activity } from '../model/Activity';
import { IRepoProject } from '../IRepository/IRepoProject';
import { Status } from '@app/domain/model/Status';
import { ProjectCode } from '@app/domain/model/project.code';
import { CollabEmail } from '@app/domain/model/collab.email';
import { Raison } from '@app/domain/model/Raison';
import { Collab } from '@app/domain/model/Collab';

@Injectable()
export class CraService {
  constructor(
    @Inject('IRepoCollab') private readonly repoCollab: IRepoCollab,
    @Inject('IRepoCra') private readonly repoCra: IRepoCra,
    @Inject('IRepoProject') private readonly repoProject: IRepoProject,
    @Inject('IRepoHoliday') private readonly repoHoliday: IRepoHoliday,
  ) {}

  async deleteAbsence(id: string, date: Date, raison: Raison) {
    const cra = await this.repoCra.findById(id);
    cra.etat = Etat.unsubmitted;
    cra.deleteAbsence(date, raison);
    return await this.repoCra.save(cra);
  }

  async addAbsence(createAbsenceDto: CreateAbsenceDto) {
    const dateAbs = new Date(createAbsenceDto.date);

    const collabEmail = new CollabEmail(createAbsenceDto.collabId);
    const user = await this.repoCollab.findById(collabEmail);

    // Check if the specified CRA exists
    let cra = await this.repoCra.findByMonthYearCollab(
      dateAbs.getMonth() + 1,
      dateAbs.getFullYear(),
      new CollabEmail(createAbsenceDto.collabId),
    );

    if (!cra) {
      await this.createNewCra(dateAbs, user);
    }

    cra = await this.repoCra.findByMonthYearCollab(
      dateAbs.getMonth() + 1,
      dateAbs.getFullYear(),
      new CollabEmail(createAbsenceDto.collabId),
    );

    //create absence
    const absence = new Absence(
      createAbsenceDto.percentage,
      createAbsenceDto.date,
      createAbsenceDto.raison,
    );
    // add absence to the cra
    cra.addAbsence(absence);
    //save cra and done
    await this.repoCra.save(cra);

    return absence;
  }

  async deleteActivity(id: string, date: Date, project: ProjectCode) {
    const cra = await this.repoCra.findById(id);
    cra.etat = Etat.unsubmitted;
    cra.deleteActivity(date, project);
    return await this.repoCra.save(cra);
  }

  async addActivity(createActivityDto: CreateActivityDto) {
    const dateAct = new Date(createActivityDto.date);

    const collabEmail = new CollabEmail(createActivityDto.collabId);
    const user = await this.repoCollab.findById(collabEmail);

    const project = await this.repoProject.findById(
      new ProjectCode(createActivityDto.projectId),
    );
    // Check if the specified CRA exists
    let cra = await this.repoCra.findByMonthYearCollab(
      dateAct.getMonth() + 1,
      dateAct.getFullYear(),
      new CollabEmail(createActivityDto.collabId),
    );
    if (!cra) {
      await this.createNewCra(dateAct, user);
    }
    cra = await this.repoCra.findByMonthYearCollab(
      dateAct.getMonth() + 1,
      dateAct.getFullYear(),
      new CollabEmail(createActivityDto.collabId),
    );
    //create absence
    const activity = new Activity(
      project.code,
      createActivityDto.percentage,
      dateAct,
    );
    // add absence to the cra
    cra.addActivity(activity);
    //save cra and done
    await this.repoCra.save(cra);

    return activity;
  }

  private async createNewCra(dateAct: Date, user: Collab) {
    const cra = new CRA(
      dateAct.getMonth() + 1,
      dateAct.getFullYear(),
      user.email,
      [],
      [],
      Etat.unsubmitted,
      Status.Open,
    );
    cra.holidays = await this.repoHoliday.findForCra(
      dateAct.getMonth() + 1,
      dateAct.getFullYear(),
    );
    await this.repoCra.save(cra);
  }

  async closeAllMonthCra(month: number, year: number) {
    const cras = await this.repoCra.findByMonthYear(month, year);
    const crasUnsubmitted = cras.filter((cra) => cra.etat == Etat.unsubmitted);
    if (crasUnsubmitted.length > 0) {
      throw new Error('cannot close month: there is an unsubmitted cra');
    }
    cras.forEach((cra) => {
      cra.closeCra();
      this.repoCra.save(cra);
    });
  }
}
