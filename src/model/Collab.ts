import { Absence } from "./Absence";
import { Activity } from "./Activity";

export class Collab{
    addAbsence(arg0: Absence) {
        this._absences.push(arg0);
    }
    private _activities: Activity[]=[];
    private id: any;
    private _absences: Absence[]=[];



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