export class Holiday{
    private _date:Date;
    private _name:string;

    constructor(date:Date,name:string){
        this._date=date;
        this._name=name;
    }

    public get date():Date{
        return this._date;
    }

    public get name():string{
        return this._name;
    }

}