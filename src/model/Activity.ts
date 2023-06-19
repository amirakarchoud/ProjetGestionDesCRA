import { ForbiddenException } from "@nestjs/common";
import { Collab } from "./Collab";
import { Project } from "./Project";

export class Activity {

    _collab: Collab;
    _projet: Project;
    _matin:boolean;
    _date:Date;

    constructor(collab: Collab, projet: Project,matin:boolean,date:Date) {
        const today=new Date();
        //const beforeFiveDays = new Date(date.getDate()-5); //fel CRA
        if (!projet.collabs.includes(collab) || date.getMonth()!=today.getMonth() )

            throw new ForbiddenException();

        this._collab = collab;
        this._projet = projet;
        this._matin=matin;
        this._date=date;


    }

    public set collab(collab: Collab) {
        this._collab = collab;
    }

    public set projet(projet: Project) {
        this._projet = projet;
    }

}