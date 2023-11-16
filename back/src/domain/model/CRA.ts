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
import { dateMonthsEqual } from '@app/domain/model/date.utils';
import { DateProvider } from '@app/domain/model/date-provider';
import { LocalDate, Month } from '@js-joda/core';

export type BulkAddOptions = {
  replace: boolean;
};

export class CRA {
  private _holidays: Holiday[] = [];
  private _absences: Absence[] = [];
  private _activites: Activity[] = [];
  private _month: Month;
  private _year: number;
  private _collab: CollabEmail;
  private _etat: Etat = Etat.unsubmitted;
  private _status: Status = Status.Open;
  private _history: Regul[] = [];

  constructor(
    month: Month,
    year: number,
    collab: CollabEmail,
    activities: Activity[],
    absences: Absence[],
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

  public get id(): string {
    return `${this.month.value()}-${this.year}-${this._collab.value}`;
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

  calculateBusinessDays(year: number, month: Month): number {
    const startDate = LocalDate.of(year, month, 1);
    const endDate = startDate.plusMonths(1);
    let businessDays = 0;

    let currentDate = startDate;
    while (currentDate.isBefore(endDate) || currentDate.isEqual(endDate)) {
      const dayOfWeek = currentDate.dayOfWeek();
      if (dayOfWeek.value() < 6) {
        // Exclude weekends (Saturday and Sunday)
        businessDays++;
      }
      currentDate = currentDate.plusDays(1);
    }

    return businessDays;
  }

  public get activities(): Activity[] {
    return [...this._activites];
  }

  public get absences(): Absence[] {
    return [...this._absences];
  }

  public set holidays(holidays: Holiday[]) {
    const badHoliday = holidays.find(
      (holiday) => !dateMonthsEqual(holiday.date, DateProvider.today()),
    );

    if (badHoliday != undefined) {
      throw new Error(
        'Trying to add a holiday that is not for this CRA: ' +
          JSON.stringify(badHoliday),
      );
    }
    this._holidays = holidays;
  }

  public get holidays(): Holiday[] {
    return this._holidays;
  }

  addActivity(activity: Activity) {
    const dateAct = activity.date;

    //check if holiday
    this.holidays.forEach((element) => {
      if (element.date.equals(activity.date)) {
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
        existingActivity.date.equals(dateAct) &&
        existingActivity.project === activity.project,
    );
    if (activities.length > 0) {
      throw new Error(
        `There is already an activity for project "${
          activity.project
        }" for this date "${activity.date.toString()}"`,
      );
    }

    //test if you have the right to add according to the date constraint

    const beforeFiveDays = DateProvider.today().minusDays(5);

    if (
      dateAct.month() != DateProvider.today().month() &&
      beforeFiveDays.month() != dateAct.month()
    ) {
      throw new ForbiddenException();
    }

    //check if regul
    if (this._status === Status.Closed) {
      this._history.push(new Regul(LocalDate.now(), Action.Add, activity));
    }

    this._activites.push(activity);
  }

  addAbsence(absence: Absence) {
    //check if holiday
    this.holidays.forEach((holiday) => {
      if (holiday.date.equals(absence.date)) {
        throw Error('it is a holiday :' + holiday.name);
      }
    });

    // Test if the day is already fully occupied or part of a fully occupied period
    if (this.getAvailableTime(absence.date) < absence.percentage) {
      //cra
      throw new Error('FULL day or period');
    }

    const today = DateProvider.today();
    const absDate = absence.date;

    if (
      (absDate.month().value() < today.month().value() &&
        absDate.year() == today.year()) ||
      absDate.year() < today.year()
    ) {
      throw new ForbiddenException();
    }

    //check if regul
    if (this._status == Status.Closed) {
      this._history.push(new Regul(LocalDate.now(), Action.Add, absence));
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

  public get month(): Month {
    return this._month;
  }

  public get year(): number {
    return this._year;
  }

  public get collab(): CollabEmail {
    return this._collab;
  }

  getAvailableTime(date: LocalDate): Percentage {
    const activities = this._activites.filter((activity) =>
      activity.date.equals(date),
    );

    const absences = this._absences.filter((absence) =>
      absence.date.equals(date),
    );

    const hasHoliday =
      this._holidays.filter((holiday) => holiday.date.equals(date)).length > 0;

    if (hasHoliday) {
      return 0;
    }

    return (100 -
      [...activities, ...absences]
        .map((act) => act.percentage)
        .reduce((prev, cur: Percentage) => cur + prev, 0)) as Percentage;
  }

  // formatDate(date: Date): string {
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const day = String(date.getDate()).padStart(2, '0');
  //   return `${year}-${month}-${day}`;
  // }

  deleteAbsence(date: LocalDate, raison: Raison) {
    this.absences.forEach((abs, index) => {
      if (abs.date.equals(date) && abs.raison === raison) {
        //check if regul
        if (this._status == Status.Closed) {
          this._history.push(new Regul(LocalDate.now(), Action.Delete, abs));
        }
        this._absences.splice(index, 1);
      }
    });
  }

  public bulkAdd(
    activities: Array<Activity | Absence>,
    options?: BulkAddOptions,
  ) {
    //group by day
    const activitiesByDate = new Map<string, Array<Activity | Absence>>();
    for (const currentActivity of activities) {
      const existingEntry = activitiesByDate.get(
        currentActivity.date.toString(),
      );

      if (existingEntry) {
        existingEntry.push(currentActivity);
      } else {
        activitiesByDate.set(currentActivity.date.toString(), [
          currentActivity,
        ]);
      }
    }

    for (const key of activitiesByDate.keys()) {
      if (options?.replace) {
        this.cleanDate(LocalDate.parse(key));
      }

      activitiesByDate.get(key).forEach((act) => {
        if (act instanceof Activity) {
          this.addActivity(act);
        } else if (act instanceof Absence) {
          this.addAbsence(act);
        }
      });
    }
  }

  /**
   * This method will clean a given date of absences and activities.
   * It is used in "replace mode"
   * @param date the date for which to delete absences and activities
   * @private it should only be called if replace mode is "true"
   */
  public cleanDate(date: LocalDate) {
    this.absences.forEach((abs: Absence) => {
      if (abs.date.equals(date)) {
        this.deleteAbsence(abs.date, abs.raison);
      }
    });

    this.activities.forEach((act: Activity) => {
      if (act.date.equals(date)) {
        this.deleteActivity(act.date, act.project);
      }
    });
  }

  deleteActivity(date: LocalDate, project: ProjectCode) {
    this.activities.forEach((act, index) => {
      if (act.date.equals(date) && act.project.value === project.value) {
        if (this._status == Status.Closed) {
          this._history.push(new Regul(LocalDate.now(), Action.Delete, act));
        }
        this._activites.splice(index, 1);
      }
    });
  }

  getAvailableDatesOfCra(): LocalDate[] {
    const startDate = LocalDate.of(this.year, this.month, 1);
    const endDate = startDate.plusMonths(1);
    const availableDates: LocalDate[] = [];

    let currentDate = startDate;
    while (currentDate.isBefore(endDate)) {
      const isWeekend = this.isWeekend(currentDate);
      const isHoliday = this.checkDateIsHoliday(currentDate);
      const isActivityOrAbsenceExists = this.checkDayIsFull(currentDate);

      if (!isWeekend && !isHoliday && !isActivityOrAbsenceExists) {
        availableDates.push(currentDate);
      }

      currentDate = currentDate.plusDays(1);
    }

    return availableDates;
  }

  isWeekend(date: LocalDate): boolean {
    const dayOfWeek = date.dayOfWeek();
    return dayOfWeek.value() >= 6;
  }

  checkDateIsHoliday(date: LocalDate): boolean {
    return this.holidays.some((hol) => hol.date.equals(date));
  }

  checkDayIsFull(date: LocalDate): boolean {
    return this.getAvailableTime(date) < 100;
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
      _holidays: this._holidays.map((hol) => hol.mapToJson()),
      _absences: this._absences.map((abs) => abs.mapToJson()),
      _activites: this._activites.map((act) => act.mapToJson()),
      _month: this._month.value(),
      _year: this._year,
      _collab: this._collab.value,
      _etat: this._etat,
      _status: this._status,
      _history: this._history,
    };
  }

  static fromJson(json: any): CRA {
    const cra = new CRA(
      Month.of(json._month),
      json._year,
      new CollabEmail(json._collab),
      [],
      [],
      json._etat,
      json._status,
    );

    cra._holidays = json._holidays.map((hol) => Holiday.fromJson(hol));
    cra._absences = json._absences.map((abs) => Absence.fromJson(abs));
    cra._activites = json._activites.map((act) => Activity.fromJson(act));
    cra._history = json._history;

    return cra;
  }
}
