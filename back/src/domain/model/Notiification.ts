import { Collab } from "./Collab";

export class Notification{
    _collab: Collab;
    _date:Date;
    _description:string;

    constructor(collab:Collab,description:string,date:Date){
        this._collab=collab;
        this._date=date;
        this._description=description;
    }

    public get collab():Collab{
        return this._collab;
    }

    public get date():Date{
        return this._date;
    }

    public get description():string{
        return this._description;
    }


}