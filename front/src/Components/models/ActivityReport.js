import { DayOfWeek, TemporalAdjusters } from '@js-joda/core';

export class ActivityReport {
  localDate;
  month;
  year;
  availableDates;
  activities;

  constructor(localDate, activities = [], availableDates = []) {
    this.localDate = localDate;
    this.month = localDate.month();
    this.year = localDate.year();
    this.activities = activities;
    this.availableDates = availableDates;
  }

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

  groupByProject() {
    const map = new Map();
    this.activities.forEach((activity) => {
      if (!map.get(activity.name)) {
        map.set(activity.name, []);
      }
      map.get(activity.name).push(activity);
    });
    return map;
  }


  getByDate(date) {
    return this.activities.filter((activity) => activity.date.equals(date));
  }

  getByActivityNameAndDate(name, date) {
    return this.activities.filter(
      (activity) => activity.name === name && activity.date.equals(date),
    )?.[0];
  }


  addActivity(type, name, date, percent) {
    let existing = this.getByActivityNameAndDate(name, date);
    if (existing) {
      existing.percent = percent;
    } else {
      this.activities.push({ type, name, date, percent });
    }
  }

  getSumActivityForGivenDay(givenDay) {
    return this.getByDate(givenDay)
      .map((activity) => activity.percent)
      .reduce((acc, cur) => acc + cur, 0);
  }

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
