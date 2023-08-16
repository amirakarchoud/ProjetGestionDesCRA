import { ForbiddenException } from '@nestjs/common';
import { Absence } from './Absence';
import { Activity } from './Activity';
import { Collab } from './Collab';
import { Etat } from './etat.enum';
import { Status } from './Status';
import { Holiday } from './Holiday';
import { Regul } from './Regul';
import { Action } from './action.enum';

export class CRA {
  private _id: number;
  private _holidays: Holiday[] = [];
  private _absences: Absence[] = [];
  private _activites: Activity[] = [];
  private _month: number;
  private _year: number;
  private _collab: Collab;
  private _date: Date;
  private _etat: Etat = Etat.unsubmitted;
  private _status: Status = Status.Open;
  private _history: Regul[] = [];
  constructor(
    id: number,
    month: number,
    year: number,
    collab: Collab,
    date: Date,
    etat: Etat,
    status: Status,
  ) {
    this._id = id;
    this._month = month;
    this._year = year;
    this._date = date;
    this._collab = collab;
    this._holidays = [];
    this._etat = etat;
    this._status = status;
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

  checkActivityOrAbsenceExists(date: Date, matin: boolean): boolean {
    const existingActivity = this._activites.find(
      (activity) =>
        this.formatDate(activity.date) === this.formatDate(date) &&
        activity.matin === matin,
    );
    if (existingActivity) {
      return true;
    }

    const existingAbsence = this._absences.find(
      (absence) =>
        this.formatDate(absence.date) === this.formatDate(date) &&
        absence.matin === matin,
    );
    if (existingAbsence) {
      return true;
    }

    const activities = this._activites.filter(
      (activity) => this.formatDate(activity.date) === this.formatDate(date),
    );
    const absences = this._absences.filter(
      (absence) => this.formatDate(absence.date) === this.formatDate(date),
    );
    if (activities.length + absences.length > 1) {
      return true;
    }
    return false;
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
    if (this.checkActivityOrAbsenceExists(dateAct, activity.matin)) {
      //cra
      throw new Error('FULL day or period');
    }

    //test if you have the right to add according to the date constraint

    const today = new Date();
    const beforeFiveDays = new Date(); //fel CRA
    beforeFiveDays.setDate(today.getDate() - 5);

    if (
      dateAct.getMonth() != today.getMonth() &&
      beforeFiveDays.getMonth() != dateAct.getMonth()
    ) {
      throw new ForbiddenException();
    }

    //check if regul
    if (this._status == Status.Closed) {
      this._history.push(new Regul(0, new Date(), Action.Add, activity));
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
    if (this.checkActivityOrAbsenceExists(dateAbs, absence.matin)) {
      //cra
      throw new Error('FULL day or period');
    }

    const today = new Date();
    const beforeFiveDays = new Date(); //fel CRA
    beforeFiveDays.setDate(today.getDate() - 5);
    const absDate = new Date(absence.date);

    if (
      absDate.getMonth() != today.getMonth() &&
      beforeFiveDays.getMonth() != absDate.getMonth()
    ) {
      throw new ForbiddenException();
    }

    //check if regul
    if (this._status == Status.Closed) {
      this._history.push(new Regul(0, new Date(), Action.Add, absence));
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
    if (this.calculateEmptyDays() == 0) return true;
    return false;
  }

  public get id(): number {
    return this._id;
  }

  public get month(): number {
    return this._month;
  }
  public get year(): number {
    return this._year;
  }

  public get date(): Date {
    return this._date;
  }
  public get collab(): Collab {
    return this._collab;
  }

  verifyDateNotInCRA(date: Date, periode: boolean): boolean {
    const formattedDate = this.formatDate(new Date(date));

    const hasActivity = this._activites.filter(
      (activity) => this.formatDate(activity.date) === formattedDate,
    );

    const hasAbsence = this._absences.filter(
      (absence) => this.formatDate(absence.date) === formattedDate,
    );

    // const hasHoliday = this._holidays.filter(holiday => this.formatDate(holiday.date) === formattedDate);

    const num = hasActivity.length + hasAbsence.length;

    if (num === 0) {
      return true;
    } else if (num > 1) {
      return false;
    } else {
      const existingItem = hasActivity[0] || hasAbsence[0];
      const existingBoolean = existingItem.matin;

      return existingBoolean !== periode;
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  deleteAbsence(date: Date, matin: boolean) {
    this.absences.forEach((abs, index) => {
      if (
        this.formatDate(abs.date) === this.formatDate(date) &&
        abs.matin === matin
      ) {
        //check if regul
        if (this._status == Status.Closed) {
          this._history.push(new Regul(0, new Date(), Action.Delete, abs));
        }
        this.absences.splice(index, 1);
      }
    });
  }

  deleteActivity(date: Date, matin: boolean) {
    this.activities.forEach((act, index) => {
      if (
        this.formatDate(new Date(act.date)) ===
          this.formatDate(new Date(date)) &&
        act.matin === matin
      ) {
        if (this._status == Status.Closed) {
          this._history.push(new Regul(0, new Date(), Action.Delete, act));
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
  public getActivityCountByProject(): Map<string, number> {
    const projectActivityCountMap: Map<string, number> = new Map();
    for (const activity of this._activites) {
      const projectCode = activity.project.code;
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
}
