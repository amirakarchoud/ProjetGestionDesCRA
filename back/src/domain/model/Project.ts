import { ProjetStatus } from './projetStatus.enum';
import { ProjectCode } from '@app/domain/model/project.code';

export class Project {
  private readonly _collabs: string[] = [];
  private readonly _code: ProjectCode;
  private readonly _name: string;
  private readonly _client: string;
  private readonly _date: Date;
  private _status: ProjetStatus = ProjetStatus.Active;

  constructor(
    code: ProjectCode,
    collabs: string[],
    name: string,
    client: string,
    date: Date,
    status: ProjetStatus,
  ) {
    if (!(code && collabs)) {
      throw new Error('cannot have a null attribut');
    }
    this._code = code;
    this._collabs = collabs;
    this._name = name;
    this._client = client;
    this._date = date;
    this._status = status;
  }
  addCollab(collab: string) {
    this._collabs.push(collab);
  }

  public get collabs(): string[] {
    return this._collabs;
  }

  public get code(): ProjectCode {
    return this._code;
  }

  public get name(): string {
    return this._name;
  }

  public get client(): string {
    return this._client;
  }

  public get date(): Date {
    return this._date;
  }

  public get status(): ProjetStatus {
    return this._status;
  }

  public desctivateProject() {
    this._status = ProjetStatus.Desactive;
  }
}
