import { Collab } from "./Collab";

export class Project{
   private  _collabs: Collab[]=[];
   private  _id:number;
   private _code:string;
    addCollab(collab: Collab) {
        this._collabs.push(collab);
    }

    public get collabs():Collab[]{

        return this._collabs;
    }
    public get id():number{
        return this._id;
    }
    public get code():string{
        return this._code;
    }

}