import { Collab } from "./Collab";

export class Project{
    _collabs: Collab[]=[];
    addCollab(collab: Collab) {
        this._collabs.push(collab);
    }

    public get collabs():Collab[]{

        return this._collabs;
    }

}