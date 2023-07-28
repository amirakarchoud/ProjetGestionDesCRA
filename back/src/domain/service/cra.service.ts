import { CreateAbsenceDto } from '../../Dto/CreateAbsenceDto';
import { IRepoCollab } from '../IRepository/IRepoCollab';
import { IRepoCra } from '../IRepository/IRepoCra';
import { IRepoHoliday } from '../IRepository/IRepoHoliday';
import { Absence } from '../model/Absence';
import { CRA } from '../model/CRA';
import { Inject, Injectable } from '@nestjs/common';
import { Etat } from '../model/etat.enum';
import { CreateActivityDto } from '../../Dto/CreateActivityDto';
import { Activity } from '../model/Activity';
import { IRepoProject } from '../IRepository/IRepoProject';
import { Status } from '@app/domain/model/Status';

@Injectable()
export class CraService {
  constructor(
    @Inject('IRepoCollab') private readonly repoCollab: IRepoCollab,
    @Inject('IRepoCra') private readonly repoCra: IRepoCra,
    @Inject('IRepoProject') private readonly repoProject: IRepoProject,
    @Inject('IRepoHoliday') private readonly repoHoliday: IRepoHoliday,
  ) {}

  async deleteAbsence(id: number, date: Date, matin: boolean) {
    const cra = await this.repoCra.findById(id);
    cra.etat = Etat.unsubmitted;
    cra.deleteAbsence(date, matin);
    return await this.repoCra.save(cra);
  }

  async addAbsence(createAbsenceDto: CreateAbsenceDto) {
    const dateAbs = new Date(createAbsenceDto.date);
    const user = await this.repoCollab.findById(createAbsenceDto.collabId);
    // Check if the specified CRA exists
    let cra = await this.repoCra.findByMonthYearCollab(
      dateAbs.getMonth() + 1,
      dateAbs.getFullYear(),
      createAbsenceDto.collabId,
    );
    if (!cra) {
      cra = new CRA(
        0,
        dateAbs.getMonth() + 1,
        dateAbs.getFullYear(),
        user,
        new Date(),
        Etat.unsubmitted,
        Status.Open,
      );
      cra.holidays = await this.repoHoliday.findForCra(
        dateAbs.getMonth() + 1,
        dateAbs.getFullYear(),
      );
      await this.repoCra.save(cra);
    }
    cra = (await this.repoCra.findByMonthYearCollab(
      dateAbs.getMonth() + 1,
      dateAbs.getFullYear(),
      createAbsenceDto.collabId,
    )) as CRA;
    console.log('cra etat here = ' + cra.etat);
    //create absence
    console.log(
      'create absence craid=' +
        cra.id +
        ' matin= ' +
        createAbsenceDto.matin +
        ' date= ' +
        createAbsenceDto.date +
        ' raison= ' +
        createAbsenceDto.raison,
    );
    const absence = new Absence(
      0,
      cra.id,
      createAbsenceDto.matin,
      createAbsenceDto.date,
      createAbsenceDto.raison,
    );
    // add absence to the cra
    cra.addAbsence(absence);
    //save cra and done
    await this.repoCra.save(cra);

    return absence;
  }

  async deleteActivity(id: number, date: Date, matin: boolean) {
    const cra = await this.repoCra.findById(id);
    cra.etat = Etat.unsubmitted;
    cra.deleteActivity(date, matin);
    return await this.repoCra.save(cra);
  }

  async addActivity(createActivityDto: CreateActivityDto) {
    const dateAct = new Date(createActivityDto.date);
    const user = await this.repoCollab.findById(createActivityDto.collabId);
    const project = await this.repoProject.findById(
      createActivityDto.projectId,
    );
    // Check if the specified CRA exists
    let cra = await this.repoCra.findByMonthYearCollab(
      dateAct.getMonth() + 1,
      dateAct.getFullYear(),
      createActivityDto.collabId,
    );
    if (!cra) {
      cra = new CRA(
        0,
        dateAct.getMonth() + 1,
        dateAct.getFullYear(),
        user,
        new Date(),
        Etat.unsubmitted,
        Status.Open,
      );
      cra.holidays = await this.repoHoliday.findForCra(
        dateAct.getMonth() + 1,
        dateAct.getFullYear(),
      );
      await this.repoCra.save(cra);
    }
    cra = (await this.repoCra.findByMonthYearCollab(
      dateAct.getMonth() + 1,
      dateAct.getFullYear(),
      createActivityDto.collabId,
    )) as CRA;
    //create absence
    const activity = new Activity(
      0,
      user,
      project,
      createActivityDto.matin,
      dateAct,
      cra.id,
    );
    console.log('activities len before add = ' + cra.activities.length);
    // add absence to the cra
    cra.addActivity(activity);
    console.log('activities len after add = ' + cra.activities.length);
    //save cra and done
    await this.repoCra.save(cra);

    return activity;
  }
}
