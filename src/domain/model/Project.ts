import { Exclude } from "class-transformer";
import { Activity } from "./Activity";
import { Collab } from "./Collab";

export class Project{
    
   private  _collabs: Collab[]=[];
   private _code:string;
   private _activities:Activity[]=[];
   toJSON(): object {
    return {
      code: this._code
    };
  }
   constructor(code:string,collabs:Collab[]){
   
    this._code=code;
    this._collabs=collabs;
   }
    addCollab(collab: Collab) {
        this._collabs.push(collab);
    }

    public get collabs():Collab[]{

        return this._collabs;
    }
   
    public get code():string{
        return this._code;
    }
    public get activities():Activity[]{
        return this._activities;
    }

}