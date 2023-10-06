export class DateProvider {
  private static _today: Date;

  static today() {
    if (this._today) {
      return this._today;
    }
    return new Date();
  }

  static setTodayDate(date: Date) {
    this._today = date;
  }
}
