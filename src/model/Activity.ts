import { ForbiddenException } from "@nestjs/common";
import { Collab } from "./Collab";
import { Project } from "./Project";
import { HolidayAdapter } from "./HolidayAdapter";

export class Activity {

    private _collab: Collab;
    private _projet: Project;
    private _matin: boolean;
    private _date: Date;

    constructor(collab: Collab, projet: Project, matin: boolean, date: Date, holidays: any) {

        //step1:check if the date is a holiday
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());

        const formattedDate = `${year}-${month}-${day}`;
        for (const holiday of holidays) {
            if (holiday.date === formattedDate) {
                throw new ForbiddenException();
            }
        }

        //step 2: check if its the collab's
        
        if (!projet.collabs.includes(collab) )

            throw new ForbiddenException();

        this._collab = collab;
        this._projet = projet;
        this._matin = matin;
        this._date = date;


    }

    public set collab(collab: Collab) {
        this._collab = collab;
    }

    public set projet(projet: Project) {
        this._projet = projet;
    }

    public get date(): Date {
        return this._date;
    }

    public get matin():boolean{
        return this._matin;
    }

}