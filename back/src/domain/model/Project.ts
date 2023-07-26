import { Activity } from './Activity';

export class Project {
  private _collabs: string[] = [];
  private _code: string;
  private _activities: Activity[] = [];
  toJSON(): object {
    return {
      code: this._code,
      collabs: this._collabs,
    };
  }
  constructor(code: string, collabs: string[]) {
    if (!(code && collabs)) {
      throw new Error('cannot have a null attribut');
    }
    this._code = code;
    this._collabs = collabs;
  }
  addCollab(collab: string) {
    this._collabs.push(collab);
  }

  public get collabs(): string[] {
    return this._collabs;
  }

  public get code(): string {
    return this._code;
  }
  public get activities(): Activity[] {
    return this._activities;
  }
}
