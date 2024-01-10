import {
  DateTimeFormatter,
  DayOfWeek,
  LocalDate,
  TemporalAdjusters,
} from '@js-joda/core';
import { toast } from 'react-toastify';
import { Absences, ActivityTypes } from '../const/ActivityReport.constant';
import { postActivitiesMapper } from '../../Services/Mappers/postActivities.mapper';

export class ActivityReport {
  activities;
  activityReportApi;
  availableDates;
  holidays;
  localDate;
  month;
  year;

  /**
   *
   * @param localDate {LocalDate}
   * @param activities {Array<{code: string; date: LocalDate; name: string; percentage: number; type: 'absence'|'project'}>}
   * @param availableDates {{availableTime: number; date: LocalDate;}[]}
   * @param holidays {{date: LocalDate; name: string; percentage: number; type: ActivityTypes.Holiday}[]}
   */
  constructor(
    localDate,
    activities = [],
    availableDates = [],
    holidays = [],
    activityReportApi,
  ) {
    this.localDate = localDate;
    this.month = localDate.month();
    this.year = localDate.year();
    this.activities = activities;
    this.availableDates = availableDates;
    this.holidays = holidays;
    this.activityReportApi = activityReportApi;
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
    return [...this.holidays].map((h) =>
      h.date.format(DateTimeFormatter.ISO_LOCAL_DATE),
    );
  }

  /**
   *
   * @returns {{code: string; date: LocalDate; name: string; percentage: number; type: 'absence'|'project'}[]}
   */
  weekActivities() {
    return this.activities.filter(
      (activity) =>
        !activity.date.isBefore(this.getMonday()) &&
        !activity.date.isAfter(this.getMonday().plusDays(4)),
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
   * @returns {{code: string; date: LocalDate; name: string; percentage: number; type: 'absence'|'project'}[]}
   */
  getByDate(date) {
    return this.activities.filter((activity) => activity.date.equals(date));
  }

  /**
   *
   * @param code {string}
   * @param date {LocalDate}
   * @returns {{code: string; date: LocalDate; name: string; percentage: number; type: 'absence'|'project'}}
   */
  getByActivityNameAndDate(code, date) {
    return this.activities.filter(
      (activity) => activity.code === code && activity.date.equals(date),
    )?.[0];
  }

  /**
   *
   * @param activities {{code: string; date: LocalDate; name: string; percentage: number; type: 'absence'|'project'}[]}
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
      this.activities.push({ code, date, name, percentage, type });
    }
  }

  /**
   * @param previousCode {string}
   * @param newCode {string}
   * @param type {('absence'|'project')}
   */
  updateActivityCode(previousCode, newCode, type) {
    let keys;
    if (type === ActivityTypes.Absence) keys = Object.keys(this.weekAbsences());
    if (type === ActivityTypes.Project) keys = Object.keys(this.weekProjects());
    if (!keys.includes(newCode)) {
      this.activities.forEach((activity) => {
        if (
          activity.code === previousCode &&
          this.isoWeek().includes(
            activity.date.format(DateTimeFormatter.ISO_LOCAL_DATE),
          )
        ) {
          activity.code = newCode;
          activity.name = Absences[newCode];
        }
      });
      toast.success(`Absence modification succeed.`);
    } else {
      toast.error(`${Absences[newCode]} is already used !`);
    }
  }

  /**
   * @param code {string}
   */
  deleteWeekActivity(code) {
    const oldActivities = [...this.activities];
    this.activities = [
      ...oldActivities.filter(
        (activity) =>
          !(
            activity.code === code &&
            this.isoWeek().includes(
              activity.date.format(DateTimeFormatter.ISO_LOCAL_DATE),
            )
          ),
      ),
    ];
  }

  cleanWeekActivity() {
    this.weekActivities().forEach((activity) => {
      if (activity.percentage === 0) {
        this.deleteActivity(activity);
      }
    });
  }

  /**
   *
   * @param activity {{code: string; date: LocalDate; name: string; percentage: number; type: ('absence'|'project')}}
   */
  deleteActivity(activity) {
    const oldActivities = [...this.activities];
    this.activities = [
      ...oldActivities.filter(
        (a) =>
          !(
            a.code === activity.code &&
            a.date.equals(activity.date) &&
            a.type === activity.type
          ),
      ),
    ];
  }

  validateWeek() {
    this.cleanWeekActivity();
    const toBeValidatedDates = [...this.week()].filter(
      (date) =>
        !this.isoHolidaysDates().includes(
          date.format(DateTimeFormatter.ISO_LOCAL_DATE),
        ),
    );
    if (
      toBeValidatedDates.every(
        (date) => this.getSumActivityForGivenDay(date) === 100,
      ) &&
      this.weekActivities().length !== 0
    ) {
      this.activityReportApi
        .postActivities(
          postActivitiesMapper(
            this.weekActivities(),
            'aleksandar.kirilov@proxym.fr',
            this.month.value(),
            this.year,
          ),
        )
        .then();
      toast.success('Validation succeed.');
    } else {
      toast.error('Invalid week !');
      //throw new Error("This week is incorrect!");
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

  nextWeek() {
    this.localDate = this.getMonday().plusWeeks(1);
  }

  previousWeek() {
    this.localDate = this.getMonday().minusWeeks(1);
  }
}
