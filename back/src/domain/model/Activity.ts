import { Percentage } from '@app/domain/percentage.type';
import { ProjectCode } from '@app/domain/model/project.code';
import { LocalDate, nativeJs } from '@js-joda/core';

export class Activity {
  private _project: ProjectCode;
  private _percentage: Percentage;
  private _date: LocalDate;

  toJSON(): object {
    return {
      percentage: this._percentage,
      date: this._date.toJSON(),
      project: this._project.value,
    };
  }

  constructor(projet: ProjectCode, percentage: Percentage, date: LocalDate) {
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
  }

  public get project(): ProjectCode {
    return this._project;
  }

  public get date(): LocalDate {
    return this._date;
  }

  public get percentage(): Percentage {
    return this._percentage;
  }

  static fromJson(json: any): Activity {
    if (!json) {
      throw new Error('Invalid JSON data');
    }

    return new Activity(
      new ProjectCode(json._project._code),
      json._percentage as Percentage,
      LocalDate.parse(json._date),
    );
  }

  mapToJson(): any {
    return {
      _percentage: this._percentage,
      _date: this._date.toString(),
      _project: this._project,
    };
  }
}
