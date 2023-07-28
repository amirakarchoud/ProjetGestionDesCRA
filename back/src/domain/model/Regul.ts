import { Action } from './action.enum';
import { Absence } from './Absence';
import { Activity } from './Activity';

export class Regul {
  private _id: number;
  private _date: Date;
  private _action: Action;
  private _target: Activity | Absence;

  constructor(
    id: number,
    date: Date,
    action: Action,
    target: Activity | Absence,
  ) {
    this._id = id;
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
  public get id(): number {
    return this._id;
  }
  public get date(): Date {
    return this._date;
  }
}
