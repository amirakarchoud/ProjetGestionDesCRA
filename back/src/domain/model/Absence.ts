import { Raison } from './Raison';

export class Absence {
  private _percentage: number;
  private _craId: number;

  constructor(cra: number, percentage: number, date: Date, raison: Raison) {
    if (raison == null) {
      throw new Error('cannot have a null attribut');
    }
    if (date == null) {
      throw new Error('cannot have a null attribut');
    }
    if (cra == null) {
      throw new Error('cannot have a null attribut');
    }
    if (percentage == null) {
      throw new Error('cannot have a null attribut');
    }
    this._craId = cra;
    this._percentage = percentage;
    this._date = date;
    this._raison = raison;
  }

  private _date: Date;

  public get date(): Date {
    return this._date;
  }

  private _raison: Raison;

  public get raison(): Raison {
    return this._raison;
  }

  public get cra(): number {
    return this._craId;
  }

  public get percentage(): number {
    return this._percentage;
  }

  toJSON(): object {
    return {
      percentage: this._percentage,
      date: this._date,
      raison: this._raison,
    };
  }
}
