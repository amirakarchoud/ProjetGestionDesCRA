import { Role } from './Role';
import { ProjectCode } from '@app/domain/model/project.code';
import { CollabEmail } from '@app/domain/model/collab.email';

export class Collab {
  private readonly _email: CollabEmail;
  private readonly _name: string;
  private readonly _lastname: string;
  private readonly _projects: ProjectCode[] = [];

  constructor(
    email: CollabEmail,
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

  private _role: Role;

  public get role(): Role {
    return this._role;
  }

  public set role(role: Role) {
    this._role = role;
  }

  private _password: string;

  public get password(): string {
    return this._password;
  }

  public set password(em: string) {
    this._password = em;
  }

  public get lastname(): string {
    return this._lastname;
  }

  public get email(): CollabEmail {
    return this._email;
  }

  public get name(): string {
    return this._name;
  }

  public get projects(): ProjectCode[] {
    return this._projects;
  }

  static fromJson(json: any): Collab {
    if (!json) {
      return undefined;
    }

    return new Collab(
      new CollabEmail(json._id),
      json._name,
      json._lastname,
      json._role,
      json._projects || [],
    );
  }

  addProject(project: ProjectCode) {
    this._projects.push(project);
  }
}
