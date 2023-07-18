import { Collab } from "./Collab";
import { Project } from "./Project";
export declare class Activity {
    private _id;
    private _collab;
    private _project;
    private _matin;
    private _date;
    private _craId;
    toJSON(): object;
    get id(): number;
    constructor(id: number, collab: Collab, projet: Project, matin: boolean, date: Date, cra: number);
    set collab(collab: Collab);
    set project(projet: Project);
    get project(): Project;
    get date(): Date;
    get matin(): boolean;
    get cra(): number;
}
