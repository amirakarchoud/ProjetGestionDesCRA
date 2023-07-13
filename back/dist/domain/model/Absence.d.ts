import { Raison } from "./Raison";
export declare class Absence {
    private _matin;
    private _date;
    private _raison;
    private _craId;
    toJSON(): object;
    constructor(id: number, matin: boolean, date: Date, raison: Raison);
    get id(): number;
    get matin(): boolean;
    get date(): Date;
    get raison(): Raison;
}
