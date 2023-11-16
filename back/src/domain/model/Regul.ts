import { Action } from './action.enum';
import { Absence } from './Absence';
import { Activity } from './Activity';
import { LocalDate } from '@js-joda/core';

export class Regul {
  private _date: LocalDate;
  private _action: Action;
  private _target: Activity | Absence;

  constructor(date: LocalDate, action: Action, target: Activity | Absence) {
    this._date = date;
    this._action = action;
    this._target = target;
  }

  public get target(): Activity | Absence {
    return this._target;
  }
  public get action(): Action {
    return this._action;
  }
  public get date(): LocalDate {
    return this._date;
  }
}
