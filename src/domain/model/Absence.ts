import { ForbiddenException } from "@nestjs/common";
import { Collab } from "./Collab";
import { Raison } from "./Raison";
import { CRA } from "./CRA";

export class Absence{
   // private _id:number;
    private _collab: Collab;
    private _matin:boolean;
    private _date:Date;
    private _raison:Raison;
    private _cra: CRA;


    constructor(collab: Collab,matin:boolean,date:Date,raison:Raison,cra:CRA) {

        this._collab = collab;
        this._matin=matin;
        this._date=date;
        this._raison=raison;
        this._cra=cra;


    }

    public get collab():Collab{
        return this._collab;
    }

    public get cra():CRA{
        return this._cra;
    }

    public get matin():boolean{
        return this._matin;
    }

    public get date():Date{
        return this._date;
    }

    public get raison():Raison{
        return this._raison;
    }
}