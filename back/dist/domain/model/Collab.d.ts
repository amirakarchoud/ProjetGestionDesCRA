import { Absence } from "./Absence";
import { Activity } from "./Activity";
import { CRA } from "./CRA";
import { Project } from "./Project";
import { Role } from "./Role";
export declare class Collab {
    private _role;
    private _name;
    private _email;
    private _cras;
    private _projects;
    private _activities;
    private _absences;
    constructor(email: string, name: string, role: Role);
    get email(): string;
    get role(): Role;
    set role(role: Role);
    addAbsence(arg0: Absence): void;
    addActivity(arg0: Activity): void;
    addProject(arg0: Project): void;
    get activities(): Activity[];
    get absences(): Absence[];
    get name(): string;
    get cras(): CRA[];
    get projects(): Project[];
    set email(em: string);
}
