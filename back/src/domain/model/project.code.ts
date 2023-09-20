export class ProjectCode {
  constructor(private _code: string) {}

  public get value(): string {
    return this._code;
  }
}
