import { ForbiddenException } from "@nestjs/common";
import { Collab } from "./Collab";
import { Raison } from "./Raison";

export class Absence{
    private _collab: Collab;
    private _matin:boolean;
    private _date:Date;
    private _raison:Raison;


    constructor(collab: Collab,matin:boolean,date:Date,raison:Raison) {
        const today=new Date();
        let beforeFiveDays = new Date(); //fel CRA
        beforeFiveDays.setDate(today.getDate()-5);
        console.log(beforeFiveDays.getDate());
        if ( (date.getMonth()!=today.getMonth() && beforeFiveDays.getMonth() != date.getMonth()))

            throw new ForbiddenException();

        this._collab = collab;
        this._matin=matin;
        this._date=date;
        this._raison=raison;


    }
}