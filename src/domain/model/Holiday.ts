export class Holiday{
    private _id:number;
    private _date:Date;
    private _name:string;

    constructor(id:number,date:Date,name:string){
        this._id=id;
        this._date=date;
        this._name=name;
    }

    public get date():Date{
        return this._date;
    }

    public get name():string{
        return this._name;
    }

    public get id():number{
        return this._id;
    }

}