import { Activity } from "./Activity";
export declare class Project {
    private _collabs;
    private _code;
    private _activities;
    toJSON(): object;
    constructor(code: string, collabs: string[]);
    addCollab(collab: string): void;
    get collabs(): string[];
    get code(): string;
    get activities(): Activity[];
}
