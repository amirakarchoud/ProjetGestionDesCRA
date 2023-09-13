import { Project } from './Project';

export class Activity {
  private _craId: number;

  constructor(projet: Project, percentage: number, date: Date, cra: number) {
    if (date == null) {
      throw new Error('cannot have a null attribut');
    }
    if (projet == null) {
      throw new Error('cannot have a null attribut');
    }
    if (percentage == null) {
      throw new Error('cannot have a null attribut');
    }
    this._project = projet;
    this._percentage = percentage;
    this._date = date;
    this._craId = cra;
  }

  private _project: Project;

  public get project(): Project {
    return this._project;
  }

  private _percentage: number;

  public get percentage(): number {
    return this._percentage;
  }

  private _date: Date;

  public get date(): Date {
    return this._date;
  }

  public get cra(): number {
    return this._craId;
  }

  toJSON(): object {
    return {
      percentage: this._percentage,
      date: this._date,
      project: this._project,
    };
  }
}
