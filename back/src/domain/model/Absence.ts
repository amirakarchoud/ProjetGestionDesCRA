import { Raison } from './Raison';
import { Percentage } from '@app/domain/percentage.type';
import { LocalDate, nativeJs } from '@js-joda/core';

export class Absence {
  private _percentage: Percentage;
  private _date: LocalDate;
  private _raison: Raison;

  toJSON(): object {
    return {
      matin: this._percentage,
      date: this._date,
      raison: this._raison,
    };
  }

  constructor(percentage: Percentage, date: LocalDate, raison: Raison) {
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

  public get date(): LocalDate {
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
      LocalDate.parse(json._date),
      json._raison,
    );
  }

  mapToJson(): any {
    return {
      _percentage: this._percentage,
      _date: this._date.toString(),
      _raison: this._raison,
    };
  }
}
