"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Activity = void 0;
class Activity {
    toJSON() {
        return {
            matin: this._matin,
            date: this._date,
            project: this._project,
        };
    }
    get id() {
        return this._id;
    }
    constructor(id, collab, projet, matin, date, cra) {
        this._id = id;
        this._collab = collab;
        this._project = projet;
        this._matin = matin;
        this._date = date;
        this._craId = cra;
    }
    set collab(collab) {
        this._collab = collab;
    }
    set project(projet) {
        this._project = projet;
    }
    get project() {
        return this._project;
    }
    get date() {
        return this._date;
    }
    get matin() {
        return this._matin;
    }
    get cra() {
        return this._craId;
    }
}
exports.Activity = Activity;
//# sourceMappingURL=Activity.js.map