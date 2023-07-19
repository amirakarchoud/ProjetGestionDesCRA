import { Collab } from "./Collab";
import { Project } from "./Project";
import { CRA } from "./CRA";

export class Activity {
    private _id: number;

    private _collab: Collab;
    private _project: Project;
    private _matin: boolean;
    private _date: Date;
    private _craId: number;
    toJSON(): object {
        return {
            id:this._id,
          matin: this._matin,
          date: this._date,
          project: this._project,
        };
      }


    public get id(): number {
        return this._id;
    }

    constructor(id: number, collab: Collab, projet: Project, matin: boolean, date: Date, cra: number) {

        this._id = id;

        this._collab = collab;
        this._project = projet;
        this._matin = matin;
        this._date = date;
        this._craId = cra;


    }

    public set collab(collab: Collab) {
        this._collab = collab;
    }

    public set project(projet: Project) {
        this._project = projet;
    }
    public get project(): Project {
        return this._project;
    }

    public get date(): Date {
        return this._date;
    }

    public get matin(): boolean {
        return this._matin;
    }
    public get cra(): number {
        return this._craId;
    }

}