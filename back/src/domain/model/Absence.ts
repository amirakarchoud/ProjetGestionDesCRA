import { Raison } from './Raison';
import { Percentage } from '@app/domain/percentage.type';

export class Absence {
  private _percentage: Percentage;
  private _date: Date;
  private _raison: Raison;

  toJSON(): object {
    return {
      matin: this._percentage,
      date: this._date,
      raison: this._raison,
    };
  }

  constructor(percentage: Percentage, date: Date, raison: Raison) {
    if (raison == null) {
      throw new Error('cannot have a null attribut');
    }
    if (date == null) {
      throw new Error('cannot have a null attribut');
    }
    if (percentage == null) {
      throw new Error('cannot have a null attribut');
    }

    this._percentage = percentage;
    this._date = date;
    this._raison = raison;
  }

  public get percentage(): Percentage {
    return this._percentage;
  }

  public get date(): Date {
    return this._date;
  }

  public get raison(): Raison {
    return this._raison;
  }

  static fromJson(json: any): Absence {
    if (!json) {
      throw new Error('Invalid JSON data');
    }

    return new Absence(
      json._percentage as Percentage,
      new Date(json._date),
      json._raison,
    );
  }
}
