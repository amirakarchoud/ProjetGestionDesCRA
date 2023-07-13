export declare class Holiday {
    private _id;
    private _date;
    private _name;
    constructor(id: number, date: Date, name: string);
    get date(): Date;
    get name(): string;
    get id(): number;
}
