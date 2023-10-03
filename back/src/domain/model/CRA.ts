import { ForbiddenException } from '@nestjs/common';
import { Absence } from './Absence';
import { Activity } from './Activity';
import { Etat } from './etat.enum';
import { Status } from './Status';
import { Holiday } from './Holiday';
import { Regul } from './Regul';
import { Action } from './action.enum';
import { ProjectCode } from '@app/domain/model/project.code';
import { CollabEmail } from '@app/domain/model/collab.email';
import { Raison } from '@app/domain/model/Raison';
import { Percentage } from '@app/domain/percentage.type';

export class CRA {
  private _holidays: Holiday[] = [];
  private _absences: Absence[] = [];
  private _activites: Activity[] = [];
  private _month: number;
  private _year: number;
  private _collab: CollabEmail;
  private _etat: Etat = Etat.unsubmitted;
  private _status: Status = Status.Open;
  private _history: Regul[] = [];

  constructor(
    month: number,
    year: number,
    collab: CollabEmail,
    etat: Etat,
    status: Status,
  ) {
    this._month = month;
    this._year = year;
    this._collab = collab;
    this._holidays = [];
    this._etat = etat;
    this._status = status;
  }

  private today() {
    return new Date();
  }

  public get id(): string {
    return `${this.month}-${this.year}-${this._collab.value}`;
  }

  public closeCra() {
    this._status = Status.Closed;
  }

  public get history(): Regul[] {
    return this._history;
  }

  public set history(reguls: Regul[]) {
    this._history = reguls;
  }

  public get status(): Status {
    return this._status;
  }

  public set status(stat: Status) {
    this._status = stat;
  }

  public get etat(): Etat {
    return this._etat;
  }

  public set etat(etat: Etat) {
    this._etat = etat;
  }

  calculateBusinessDays(year: number, month: number): number {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    let businessDays = 0;

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Exclude weekends (Saturday and Sunday)
        businessDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return businessDays;
  }

  public get activities(): Activity[] {
    return this._activites;
  }

  public set activities(act: Activity[]) {
    this._activites = act;
  }

  public get absences(): Absence[] {
    return this._absences;
  }

  public set absences(abs: Absence[]) {
    this._absences = abs;
  }

  public set holidays(holidays: Holiday[]) {
    this._holidays = holidays;
  }

  public get holidays(): Holiday[] {
    return this._holidays;
  }

  addActivity(activity: Activity) {
    const dateAct = new Date(activity.date);
    //check if holiday
    this.holidays.forEach((element) => {
      if (this.formatDate(element.date) == this.formatDate(activity.date)) {
        throw Error('it is a holiday :' + element.name);
      }
    });

    // Test if the day is already fully occupied or part of a fully occupied period
    if (this.getAvailableTime(dateAct) < activity.percentage) {
      //cra
      throw new Error('FULL day or period');
    }

    const activities = this._activites.filter(
      (existingActivity) =>
        this.formatDate(existingActivity.date) === this.formatDate(dateAct) &&
        existingActivity.project === activity.project,
    );
    if (activities.length > 0) {
      throw new Error(
        `There is already an activity for project "${
          activity.project
        }" for this date "${this.formatDate(activity.date)}"`,
      );
    }

    //test if you have the right to add according to the date constraint

    const beforeFiveDays = new Date(); //fel CRA
    beforeFiveDays.setDate(this.today().getDate() - 5);

    if (
      dateAct.getMonth() != this.today().getMonth() &&
      beforeFiveDays.getMonth() != dateAct.getMonth()
    ) {
      throw new ForbiddenException();
    }

    //check if regul
    if (this._status == Status.Closed) {
      this._history.push(new Regul(new Date(), Action.Add, activity));
    }

    this._activites.push(activity);
  }

  addAbsence(absence: Absence) {
    const dateAbs = new Date(absence.date);
    //check if holiday
    this.holidays.forEach((element) => {
      if (this.formatDate(element.date) == this.formatDate(dateAbs)) {
        throw Error('it is a holiday :' + element.name);
      }
    });

    // Test if the day is already fully occupied or part of a fully occupied period
    if (this.getAvailableTime(dateAbs) < absence.percentage) {
      //cra
      throw new Error('FULL day or period');
    }

    const today = new Date();
    const absDate = new Date(absence.date);

    if (
      (absDate.getMonth() < today.getMonth() &&
        absDate.getFullYear() == today.getFullYear()) ||
      absDate.getFullYear() < today.getFullYear()
    ) {
      throw new ForbiddenException();
    }

    //check if regul
    if (this._status == Status.Closed) {
      this._history.push(new Regul(new Date(), Action.Add, absence));
    }

    this._absences.push(absence);
  }

  calculateEmptyDays(): number {
    const totalHolidays = this._holidays.length;
    const totalAbsences = this._absences.length;
    const totalActivities = this._activites.length;
    const totalBusinessDays = this.calculateBusinessDays(
      this._year,
      this._month,
    );
    return (
      totalBusinessDays -
      (totalHolidays + (totalAbsences + totalActivities) * 0.5)
    );
  }

  verifyTotalDays(): boolean {
    return this.calculateEmptyDays() == 0;
  }

  public get month(): number {
    return this._month;
  }

  public get year(): number {
    return this._year;
  }

  public get collab(): CollabEmail {
    return this._collab;
  }

  getAvailableTime(date: Date): Percentage {
    const formattedDate = this.formatDate(new Date(date));

    const activities = this._activites.filter(
      (activity) => this.formatDate(activity.date) === formattedDate,
    );

    const absences = this._absences.filter(
      (absence) => this.formatDate(absence.date) === formattedDate,
    );

    // const hasHoliday = this._holidays.filter(holiday => this.formatDate(holiday.date) === formattedDate);

    return (100 -
      [...activities, ...absences]
        .map((act) => act.percentage)
        .reduce((prev, cur: Percentage) => cur + prev, 0)) as Percentage;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  deleteAbsence(date: Date, raison: Raison) {
    this.absences.forEach((abs, index) => {
      if (
        this.formatDate(abs.date) === this.formatDate(date) &&
        abs.raison === raison
      ) {
        //check if regul
        if (this._status == Status.Closed) {
          this._history.push(new Regul(new Date(), Action.Delete, abs));
        }
        this.absences.splice(index, 1);
      }
    });
  }

  deleteActivity(date: Date, project: ProjectCode) {
    this.activities.forEach((act, index) => {
      if (
        this.formatDate(act.date) === this.formatDate(date) &&
        act.project.value === project.value
      ) {
        if (this._status == Status.Closed) {
          this._history.push(new Regul(new Date(), Action.Delete, act));
        }
        this.activities.splice(index, 1);
      }
    });
  }

  getAvailableDatesOfCra(): Date[] {
    const startDate = new Date(this.year, this.month - 1, 1);
    const endDate = new Date(this.year, this.month, 0);
    const availableDates: Date[] = [];

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const isWeekend = this.isWeekend(currentDate);
      const isHoliday = this.checkDateIsHoliday(currentDate);
      const isActivityOrAbsenceExists = this.checkDayIsFull(currentDate);

      if (!isWeekend && !isHoliday && !isActivityOrAbsenceExists) {
        availableDates.push(new Date(currentDate));
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return availableDates;
  }

  isWeekend(date: Date): boolean {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  }

  checkDateIsHoliday(date: Date): boolean {
    return this.holidays.some(
      (hol) => this.formatDate(hol.date) === this.formatDate(date),
    );
  }

  checkDayIsFull(date: Date): boolean {
    const existingActivity = this.activities.filter((activity) =>
      this.isSameDate(activity.date, date),
    );
    if (existingActivity.length > 1) {
      return true;
    }

    const existingAbsence = this.absences.filter((absence) =>
      this.isSameDate(absence.date, date),
    );
    if (existingAbsence.length > 1) {
      return true;
    }

    if (existingAbsence.length + existingActivity.length > 1) {
      return true;
    }
    return false;
  }

  isSameDate(date1: Date, date2: Date): boolean {
    const year1 = date1.getFullYear();
    const month1 = date1.getMonth();
    const day1 = date1.getDate();

    const year2 = date2.getFullYear();
    const month2 = date2.getMonth();
    const day2 = date2.getDate();

    return year1 === year2 && month1 === month2 && day1 === day2;
  }

  SubmitCra(): boolean {
    if (this.getAvailableDatesOfCra().length > 0) {
      return false;
    }
    this._etat = Etat.submitted;
    return true;
  }

  public getActivityCountByProject(): Map<ProjectCode, number> {
    const projectActivityCountMap: Map<ProjectCode, number> = new Map();
    for (const activity of this._activites) {
      const projectCode = activity.project;
      if (projectActivityCountMap.has(projectCode)) {
        projectActivityCountMap.set(
          projectCode,
          projectActivityCountMap.get(projectCode) + 1,
        );
      } else {
        projectActivityCountMap.set(projectCode, 1);
      }
    }

    return projectActivityCountMap;
  }

  mapToJson(): any {
    return {
      _id: this.id,
      _holidays: this._holidays,
      _absences: this._absences,
      _activites: this._activites,
      _month: this._month,
      _year: this._year,
      _collab: this._collab.value,
      _etat: this._etat,
      _status: this._status,
      _history: this._history,
    };
  }

  static fromJson(json: any): CRA {
    const cra = new CRA(
      json._month,
      json._year,
      new CollabEmail(json._collab),
      json._etat,
      json._status,
    );

    cra._holidays = json._holidays;
    cra._absences = json._absences.map((abs) => Absence.fromJson(abs));
    cra._activites = json._activites.map((act) => Activity.fromJson(act));
    cra._history = json._history;

    return cra;
  }
}
