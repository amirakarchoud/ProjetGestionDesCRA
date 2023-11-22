import { Raison } from './Raison';
import { Percentage } from '@app/domain/percentage.type';
import { LocalDate } from '@js-joda/core';
import { Activity } from '@app/domain/model/Activity';
import { AbsenceRule } from '@app/domain/model/AbsenceRule';

export class Absence extends Activity {
  private readonly _raison: Raison;
  constructor(percentage: Percentage, date: LocalDate, raison: Raison) {
    super(percentage, date);
    if (raison == null) {
      throw new Error('cannot have a null attribute');
    }
    this._raison = raison;
    this.addActivityRule(new AbsenceRule());
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

  toJSON(): object {
    return {
      percentage: this._percentage,
      date: this._date.toJSON(),
      raison: this._raison,
    };
  }

  mapToJson(): any {
    return {
      _percentage: this._percentage,
      _date: this._date.toString(),
      _raison: this._raison,
    };
  }
}
