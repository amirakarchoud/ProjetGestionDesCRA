import { Activity } from "./Activity";

export class Collab{
    private _activities: Activity[]=[];
    id: any;



    addActivity(arg0: Activity) {
        this._activities.push(arg0);
    }

    public get activities(): Activity[] {
        return this._activities;
    }

}