import { Absence } from "./Absence";
import { Activity } from "./Activity";
import { CRA } from "./CRA";
import { Role } from "./Role";

export class Collab {
    private _role: Role;
    private _name: string;
    private _email:string;
    private _cras:CRA[]=[];

    private _activities: Activity[] = [];
    private _absences: Absence[] = [];

    constructor(email:string,name: string) { this._name = name;this._email=email; }

    public get email():string{
        return this._email;
    }


    public get role(): Role {
        return this._role;
    }
    public set role(role: Role) {
        this._role = role;
    }
    addAbsence(arg0: Absence) {
        this._absences.push(arg0);
    }
    addActivity(arg0: Activity) {
        this._activities.push(arg0);
    }

    public get activities(): Activity[] {
        return this._activities;
    }
    public get absences(): Absence[] {
        return this._absences;
    }
    public get name(): string {
        return this._name;
    }

}