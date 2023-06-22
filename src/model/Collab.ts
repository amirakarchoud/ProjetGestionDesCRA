import { Absence } from "./Absence";
import { Activity } from "./Activity";
import { Role } from "./Role";

export class Collab{
    private _role:Role;

   
    private _activities: Activity[]=[];
    private id: any;
    private _absences: Absence[]=[];


    public get role():Role{
        return this._role;
    }
    public set role(role:Role){
        this._role=role;
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

}