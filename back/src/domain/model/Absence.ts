import { Raison } from './Raison';

export class Absence {
  private _id: number;
  private _matin: boolean;
  private _date: Date;
  private _raison: Raison;
  private _craId: number;
  toJSON(): object {
    return {
      id: this._id,
      matin: this._matin,
      date: this._date,
      raison: this._raison,
    };
  }

  constructor(
    id: number,
    cra: number,
    matin: boolean,
    date: Date,
    raison: Raison,
  ) {
    this._id = id;
    this._craId = cra;
    this._matin = matin;
    this._date = date;
    this._raison = raison;
  }

  public get id(): number {
    return this._id;
  }

  public get cra(): number {
    return this._craId;
  }

  public get matin(): boolean {
    return this._matin;
  }

  public get date(): Date {
    return this._date;
  }

  public get raison(): Raison {
    return this._raison;
  }
}
