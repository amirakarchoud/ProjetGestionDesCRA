import { Project } from './Project';

export class Activity {
  private _project: Project;
  private _matin: boolean;
  private _date: Date;
  private _craId: number;
  toJSON(): object {
    return {
      matin: this._matin,
      date: this._date,
      project: this._project,
    };
  }

  constructor(projet: Project, matin: boolean, date: Date, cra: number) {
    if (date == null) {
      throw new Error('cannot have a null attribut');
    }
    if (projet == null) {
      throw new Error('cannot have a null attribut');
    }
    if (matin == null) {
      throw new Error('cannot have a null attribut');
    }
    this._project = projet;
    this._matin = matin;
    this._date = date;
    this._craId = cra;
  }

  public set project(projet: Project) {
    this._project = projet;
  }
  public get project(): Project {
    return this._project;
  }

  public get date(): Date {
    return this._date;
  }

  public get matin(): boolean {
    return this._matin;
  }
  public get cra(): number {
    return this._craId;
  }
}
