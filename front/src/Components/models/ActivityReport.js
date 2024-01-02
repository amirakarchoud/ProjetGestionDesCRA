import { DateTimeFormatter, DayOfWeek, TemporalAdjusters } from '@js-joda/core';
import { toast } from 'react-toastify';

export class ActivityReport {
  localDate;
  month;
  year;
  availableDates;
  activities;

  /**
   *
   * @param localDate {LocalDate}
   * @param activities {Array<any>}
   * @param availableDates {{availableTime: number; date: string;}[]}
   */
  constructor(localDate, activities = [], availableDates = []) {
    this.localDate = localDate;
    this.month = localDate.month();
    this.year = localDate.year();
    this.activities = activities;
    this.availableDates = availableDates;
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
      'name',
    );
  }

  weekAbsences() {
    return this.groupByKey(
      this.groupByKey(this.weekActivities() ?? [], 'type').absence ?? [],
      'name',
    );
  }

  /**
   *
   * @param date {LocalDate}
   * @returns {{date: LocalDate; name: string; percentage: number; projects: {client: string; code: string; name: string; status: string;}; type: string;}[]}
   */
  getByDate(date) {
    return this.activities.filter((activity) => activity.date.equals(date));
  }

  /**
   *
   * @param name {string}
   * @param date {LocalDate}
   * @returns {{date: LocalDate; name: string; percentage: number; projects: {client: string; code: string; name: string; status: string;}; type: string;}}
   */
  getByActivityNameAndDate(name, date) {
    return this.activities.filter(
      (activity) => activity.name === name && activity.date.equals(date),
    )?.[0];
  }

  /**
   *
   * @param activities {{date: LocalDate; name: string; percentage: number; projects: {client: string; code: string; name: string; status: string;}; type: string;}[]}
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
   *
   * @param date {LocalDate}
   * @param name {string}
   * @param percentage {number}
   * @param type {('project'|'absence')}
   */
  addActivity(date, name, percentage, type) {
    let existing = this.getByActivityNameAndDate(name, date);
    if (existing) {
      existing.percentage = percentage;
    } else {
      this.activities.push({ date, name, percentage, type });
    }
  }

  /**
   *
   * @param previousName {string}
   * @param newName {string}
   * @param type {('project'|'absence')}
   */
  updateActivity(previousName, newName, type) {
    let keys;
    if (type === 'absence') keys = Object.keys(this.weekAbsences());
    if (type === 'project') keys = Object.keys(this.weekProjects());
    if (!keys.includes(newName)) {
      const isoWeek = this.week().map((date) =>
        date.format(DateTimeFormatter.ISO_LOCAL_DATE),
      );
      this.activities.forEach((activity) => {
        if (
          activity.name === previousName &&
          isoWeek.includes(
            activity.date.format(DateTimeFormatter.ISO_LOCAL_DATE),
          )
        ) {
          activity.name = newName;
          activity.reason = newName;
        }
      });
    } else {
      toast.error(`${newName} is already used !`);
    }
  }

  /**
   *
   * @param name {string}
   */
  deleteActivity(name) {
    const isoWeek = this.week().map((date) =>
      date.format(DateTimeFormatter.ISO_LOCAL_DATE),
    );
    const oldActivities = [...this.activities];
    this.activities = [
      ...oldActivities.filter(
        (activity) =>
          !(
            activity.name === name &&
            isoWeek.includes(
              activity.date.format(DateTimeFormatter.ISO_LOCAL_DATE),
            )
          ),
      ),
    ];
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
