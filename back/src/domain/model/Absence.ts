import { Raison } from './Raison';

export class Absence {
  private _matin: boolean;
  private _date: Date;
  private _raison: Raison;
  private _craId: number;
  toJSON(): object {
    return {
      matin: this._matin,
      date: this._date,
      raison: this._raison,
    };
  }

  constructor(cra: number, matin: boolean, date: Date, raison: Raison) {
    if (raison == null) {
      throw new Error('cannot have a null attribut');
    }
    if (date == null) {
      throw new Error('cannot have a null attribut');
    }
    if (cra == null) {
      throw new Error('cannot have a null attribut');
    }
    if (matin == null) {
      throw new Error('cannot have a null attribut');
    }
    this._craId = cra;
    this._matin = matin;
    this._date = date;
    this._raison = raison;
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
