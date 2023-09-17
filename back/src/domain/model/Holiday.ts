export class Holiday {
  private readonly _date: Date;
  private readonly _name: string;

  constructor(date: Date, name: string) {
    if (!(date && name)) {
      throw new Error('cannot have a null attribute');
    }
    this._date = date;
    this._name = name;
  }

  public get id() {
    return this._date.toISOString();
  }

  public get date(): Date {
    return this._date;
  }

  public get name(): string {
    return this._name;
  }

  static fromJson(json: any): Holiday {
    return new Holiday(json._date, json._name);
  }
}
