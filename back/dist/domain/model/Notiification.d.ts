import { Collab } from "./Collab";
export declare class Notification {
    _collab: Collab;
    _date: Date;
    _description: string;
    constructor(collab: Collab, description: string, date: Date);
    get collab(): Collab;
    get date(): Date;
    get description(): string;
}
