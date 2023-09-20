import { Role } from './Role';
import { ProjectCode } from '@app/domain/model/project.code';

export class Collab {
  private _role: Role;
  private readonly _name: string;
  private readonly _lastname: string;
  private readonly _email: string;
  private readonly _projects: ProjectCode[] = [];
  private _password: string;

  constructor(
    email: string,
    name: string,
    lastname: string,
    role: Role,
    projects: ProjectCode[] = [],
  ) {
    this._lastname = lastname;
    this._name = name;
    this._email = email;
    this._role = role;
    this._projects = projects;
  }

  public get password(): string {
    return this._password;
  }

  public set password(em: string) {
    this._password = em;
  }

  public get lastname(): string {
    return this._lastname;
  }

  public get email(): string {
    return this._email;
  }

  public get role(): Role {
    return this._role;
  }
  public set role(role: Role) {
    this._role = role;
  }

  addProject(project: ProjectCode) {
    this._projects.push(project);
  }

  public get name(): string {
    return this._name;
  }

  public get projects(): ProjectCode[] {
    return this._projects;
  }

  static fromJson(json: any): Collab {
    return new Collab(
      json._email,
      json._name,
      json._lastname,
      json._role,
      json._projects || [],
    );
  }
}
