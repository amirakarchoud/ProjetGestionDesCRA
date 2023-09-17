import { Project } from './Project';
import { Role } from './Role';

export class Collab {
  private _role: Role;
  private _name: string;
  private _lastname: string;
  private _email: string;
  private _projects: Project[] = [];
  private _password: string;

  constructor(email: string, name: string, lastname: string, role: Role) {
    this._lastname = lastname;
    this._name = name;
    this._email = email;
    this._role = role;
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

  public set email(em: string) {
    this._email = em;
  }

  public get role(): Role {
    return this._role;
  }
  public set role(role: Role) {
    this._role = role;
  }

  addProject(arg0: Project) {
    this._projects.push(arg0);
  }

  public get name(): string {
    return this._name;
  }

  public get projects(): Project[] {
    return this._projects;
  }

  static fromJson(json: any): Collab {
    return new Collab(json._email, json._name, json._lastname, json._role);
  }
}
