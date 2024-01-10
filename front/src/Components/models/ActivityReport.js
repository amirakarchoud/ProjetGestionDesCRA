import {
  DateTimeFormatter,
  DayOfWeek,
  LocalDate,
  TemporalAdjusters,
  YearMonth,
} from '@js-joda/core';
import { Absences, ActivityTypeValues } from '../const/ActivityReport.constant';

/** @typedef {{code: Absences; date: LocalDate; name: Absences; percentage: number; type: 'absence';}} AbsenceActivityType */
/** @typedef {{code: string; date: LocalDate; percentage: number; type: 'project';}} ProjectActivityType */
/** @typedef {AbsenceActivityType|ProjectActivityType} ActivityType */
/** @typedef {Array<ActivityType>} ActivitiesType */
/** @typedef {Array<{availableTime: number; date: LocalDate;}>} AvailableDatesType */
/** @typedef {Array<{date: LocalDate; name: string; percentage: number; type: ActivityTypeValues.Holiday}>} HolidaysType */

export class ActivityReport {
  /**
   * @private {ActivitiesType}
   */
  _activities;
  /**
   * @private {ActivityReportApiType}
   */
  _activityReportApi;
  /**
   * @private {AvailableDatesType}
   */
  _availableDates;
  /**
   * @private {string}
   */
  _employeeEmail;
  /**
   * @private {HolidaysType}
   */
  _holidays;
  /**
   * @private {LocalDate}
   */
  _localDate;
  /**
   * @private {number}
   */
  _month;
  /**
   * @private {NotificationsHandlerType}
   */
  _notificationsHandler;
  /**
   * @private {number}
   */
  _year;

  get activities() {
    return [...this._activities];
  }
  set activities(value) {
    this._activities = value;
  }

  get activityReportApi() {
    return this._activityReportApi;
  }
  set activityReportApi(value) {
    this._activityReportApi = value;
  }

  get availableDates() {
    return [...this._availableDates];
  }
  set availableDates(value) {
    this._availableDates = value;
  }

  get employeeEmail() {
    return this._employeeEmail;
  }

  set employeeEmail(value) {
    this._employeeEmail = value;
  }

  get holidays() {
    return [...this._holidays];
  }
  set holidays(value) {
    this._holidays = value;
  }

  get localDate() {
    return this._localDate;
  }
  set localDate(value) {
    this._localDate = value;
  }

  get month() {
    return this._month;
  }

  set month(value) {
    this._month = value;
  }

  get notificationsHandler() {
    return this._notificationsHandler;
  }
  set notificationsHandler(value) {
    this._notificationsHandler = value;
  }

  get year() {
    return this._year;
  }
  set year(value) {
    this._year = value;
  }

  /**
   *
   * @param activities {ActivitiesType}
   * @param availableDates {AvailableDatesType}
   * @param employeeEmail {string}
   * @param holidays {HolidaysType}
   * @param localDate {LocalDate}
   * @param activityReportApi {ActivityReportApiType}
   * @param notificationsHandler {NotificationsHandlerType}
   */
  constructor(
    activities = [],
    availableDates = [],
    employeeEmail,
    holidays = [],
    localDate = LocalDate.now(),
    activityReportApi,
    notificationsHandler,
  ) {
    this.activities = activities;
    this.availableDates = availableDates;
    this.employeeEmail = employeeEmail;
    this.holidays = holidays;
    this.localDate = localDate;
    this.month = localDate.month().value();
    this.year = localDate.year();
    this.activityReportApi = activityReportApi;
    this.notificationsHandler = notificationsHandler;
  }

  /**
   *
   * @returns {LocalDate[]}
   */
  week() {
    return [
      this.getMonday(),
      this.getMonday().plusDays(1),
      this.getMonday().plusDays(2),
      this.getMonday().plusDays(3),
      this.getMonday().plusDays(4),
    ];
  }

  /**
   *
   * @return {string[]}
   */
  isoWeek() {
    return this.week().map((d) => d.format(DateTimeFormatter.ISO_LOCAL_DATE));
  }

  /**
   *
   * @return {string[]}
   */
  isoHolidaysDates() {
    return this.holidays.map((h) =>
      h.date.format(DateTimeFormatter.ISO_LOCAL_DATE),
    );
  }

  /**
   *
   * @returns {ActivitiesType}
   */
  weekActivities() {
    return this.activities.filter(
      (a) =>
        !a.date.isBefore(this.getMonday()) &&
        !a.date.isAfter(this.getMonday().plusDays(4)),
    );
  }

  weekProjects() {
    return this.groupByKey(
      this.groupByKey(this.weekActivities() ?? [], 'type').project ?? [],
      'code',
    );
  }

  weekAbsences() {
    return this.groupByKey(
      this.groupByKey(this.weekActivities() ?? [], 'type').absence ?? [],
      'code',
    );
  }

  /**
   *
   * @param date {LocalDate}
   * @returns {ActivitiesType}
   */
  getByDate(date) {
    return this.activities.filter((a) => a.date.equals(date));
  }

  /**
   *
   * @param code {string}
   * @param date {LocalDate}
   * @returns {ActivityType}
   */
  getByActivityNameAndDate(code, date) {
    return this.activities
      .filter((a) => a.code === code && a.date.equals(date))
      ?.shift();
  }

  /**
   *
   * @param activities {ActivitiesType}
   * @param key {string}
   * @returns {*}
   */
  groupByKey(activities, key) {
    return activities.reduce((group, activity) => {
      group[activity[key]] = group[activity[key]] ?? [];
      group[activity[key]].push(activity);
      return group;
    }, {});
  }

  /**
   * @param code {string}
   * @param date {LocalDate}
   * @param name {string}
   * @param percentage {number}
   * @param type {('absence'|'project')}
   */
  addActivity(code, date, name, percentage, type) {
    let existing = this.getByActivityNameAndDate(code, date);
    if (existing) {
      existing.percentage = percentage;
    } else {
      this.activities = [
        ...this.activities,
        { code, date, name, percentage, type },
      ];
    }
  }

  /**
   * @param previousCode {string}
   * @param newCode {string}
   * @param type {('absence'|'project')}
   */
  updateActivityCode(previousCode, newCode, type) {
    let keys;
    if (type === ActivityTypeValues.Absence)
      keys = Object.keys(this.weekAbsences());
    if (type === ActivityTypeValues.Project)
      keys = Object.keys(this.weekProjects());
    if (!keys.includes(newCode)) {
      this.activities.forEach((a) => {
        if (
          a.code === previousCode &&
          this.isoWeek().includes(
            a.date.format(DateTimeFormatter.ISO_LOCAL_DATE),
          )
        ) {
          a.code = newCode;
          a.name = Absences[newCode];
        }
      });
      this.notificationsHandler.success('Modification succeed.');
    } else {
      this.notificationsHandler.error(`${Absences[newCode]} is already used.`);
    }
  }

  /**
   * @param code {string}
   */
  deleteWeekActivity(code) {
    const oldActivities = this.activities;
    this.activities = oldActivities.filter(
      (a) =>
        !(
          a.code === code &&
          this.isoWeek().includes(
            a.date.format(DateTimeFormatter.ISO_LOCAL_DATE),
          )
        ),
    );
  }

  cleanWeekActivity() {
    this.weekActivities().forEach((a) => {
      if (a.percentage === 0) {
        this.deleteActivity(a);
      }
    });
  }

  /**
   *
   * @param activity {ActivityType}
   */
  deleteActivity(activity) {
    const oldActivities = this.activities;
    this.activities = oldActivities.filter(
      (a) =>
        !(
          a.code === activity.code &&
          a.date.equals(activity.date) &&
          a.type === activity.type
        ),
    );
  }

  validateWeek() {
    this.cleanWeekActivity();
    const toBeValidatedDates = [...this.week()]
      .filter(
        (date) =>
          !this.isoHolidaysDates().includes(
            date.format(DateTimeFormatter.ISO_LOCAL_DATE),
          ),
      )
      .filter((date) => date.month().value() === this.month);
    if (
      toBeValidatedDates.every(
        (date) => this.getSumActivityForGivenDay(date) === 100,
      ) &&
      this.weekActivities().length !== 0
    ) {
      this.activityReportApi
        .postActivities(
          this.weekActivities(),
          this.employeeEmail,
          this.month,
          this.year,
        )
        .then(
          () => this.notificationsHandler.success('Week validated.'),
          () => this.notificationsHandler.error('An error occurred.'),
        );
    } else {
      this.notificationsHandler.warning('Invalid week.');
    }
  }

  /**
   *
   * @param givenDay {LocalDate}
   * @returns {number}
   */
  getSumActivityForGivenDay(givenDay) {
    return this.getByDate(givenDay)
      .map((activity) => activity.percentage)
      .reduce((acc, cur) => acc + cur, 0);
  }

  /**
   *
   * @returns {LocalDate}
   */
  getMonday() {
    return this.localDate.with(
      TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY),
    );
  }

  /**
   * @description _yearMonthWeek return 1 YearMonth if all days in the week are in the same month
   * and 2 YearMonth if week days are shared between 2 months
   */
  yearMonthWeek() {
    return [
      ...new Set(
        [...this.week()]
          .map((d) =>
            YearMonth.parse(
              d.format(DateTimeFormatter.ISO_LOCAL_DATE),
              DateTimeFormatter.ofPattern('yyyy-MM-dd'),
            ),
          )
          .map((ym) => `${ym.year()}-${ym.month().value()}`),
      ),
    ].map((d) => YearMonth.parse(d, DateTimeFormatter.ofPattern('yyyy-M')));
  }

  /**
   * @description nextWeek sets a new localDate depending on week properties
   * IF _yearMonthWeek returns 2 YearMonth, meaning the week in split in 2 months, and the localDate month value
   * is different from the second YearMonth returns by _yearMonthWeek, it means we need to change the localDate to
   * the first of second month, this way we don't change active week, and Selects component in TableSelection.jsx
   * is able to disable proper fields
   * ELSE we just change active week
   */
  nextWeek() {
    if (
      this.yearMonthWeek().length === 2 &&
      this.localDate.month().value() !== this.yearMonthWeek()[1].month().value()
    ) {
      this.localDate = this.getMonday().plusMonths(1).withDayOfMonth(1);
    } else {
      this.localDate = this.getMonday().plusWeeks(1);
    }
  }

  /**
   * @description previousWeek sets a new localDate depending on week properties
   * IF _yearMonthWeek returns 1 YearMonth, localDate is not the first of the month already and the monday
   * of the previous week has a different month than the active month, we set localDate to the first of the
   * current month, to display previous week with only selects enable for the current month
   * ELSE IF _yearMonthWeek returns 2 YearMonth, and localDate is already the first of the month we set localDate
   * to the monday of the active week, this way it enables selects for the previous month
   * ELSE we just change active week
   */
  previousWeek() {
    if (
      this.yearMonthWeek().length === 1 &&
      !this.localDate.isEqual(this.localDate.withDayOfMonth(1)) &&
      this.getMonday().minusWeeks(1).month().value() !==
        this.yearMonthWeek().shift().month().value()
    ) {
      this.localDate = this.localDate.withDayOfMonth(1);
    } else if (
      this.yearMonthWeek().length === 2 &&
      this.localDate.isEqual(this.localDate.withDayOfMonth(1))
    ) {
      this.localDate = this.getMonday();
    } else {
      this.localDate = this.getMonday().minusWeeks(1);
    }
  }
}
