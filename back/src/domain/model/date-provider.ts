import { LocalDate } from '@js-joda/core';

export class DateProvider {
  private static _today: LocalDate;

  static today() {
    if (this._today) {
      return this._today;
    }
    return LocalDate.now();
  }

  static setTodayDate(date: LocalDate) {
    this._today = date;
  }
}
