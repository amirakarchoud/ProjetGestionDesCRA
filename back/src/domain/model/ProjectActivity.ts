import { Percentage } from '../percentage.type';
import { ProjectCode } from './project.code';
import { LocalDate } from '@js-joda/core';
import { Activity } from './Activity';
import { ProjectActivityRule } from '@app/domain/model/ProjectActivityRule';

export class ProjectActivity extends Activity {
  private readonly _project: ProjectCode;

  constructor(project: ProjectCode, percentage: Percentage, date: LocalDate) {
    super(percentage, date);
    if (project == null) {
      throw new Error('cannot have a null attribute');
    }
    this._project = project;
    this.addActivityRule(new ProjectActivityRule());
  }

  public get project(): ProjectCode {
    return this._project;
  }

  static fromJson(json: any): Activity {
    if (!json) {
      throw new Error('Invalid JSON data');
    }

    return new ProjectActivity(
      new ProjectCode(json._project._code),
      json._percentage as Percentage,
      LocalDate.parse(json._date),
    );
  }

  toJSON(): object {
    return {
      percentage: this._percentage,
      date: this._date.toJSON(),
      project: this._project.value,
    };
  }

  mapToJson(): any {
    return {
      _percentage: this._percentage,
      _date: this._date.toString(),
      _project: this._project,
    };
  }
}
