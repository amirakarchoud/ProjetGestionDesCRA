import { Percentage } from '@app/domain/percentage.type';
import { ProjectCode } from '@app/domain/model/project.code';

export class Activity {
  private _project: ProjectCode;
  private _percentage: Percentage;
  private _date: Date;
  private _craId: string;
  toJSON(): object {
    return {
      percentage: this._percentage,
      date: this._date,
      project: this._project,
    };
  }

  constructor(
    projet: ProjectCode,
    percentage: Percentage,
    date: Date,
    cra: string,
  ) {
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

  public get project(): ProjectCode {
    return this._project;
  }

  public get date(): Date {
    return this._date;
  }

  public get percentage(): Percentage {
    return this._percentage;
  }
  public get cra(): string {
    return this._craId;
  }

  static fromJson(json: any): Activity {
    if (!json) {
      throw new Error('Invalid JSON data');
    }

    return new Activity(
      new ProjectCode(json._project._code),
      json._percentage,
      new Date(json._date),
      json._cra,
    );
  }
}
