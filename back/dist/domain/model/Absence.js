"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Absence = void 0;
class Absence {
    toJSON() {
        return {
            matin: this._matin,
            date: this._date,
            raison: this._raison
        };
    }
    constructor(id, cra, matin, date, raison) {
        this._id = id;
        this._craId = cra;
        this._matin = matin;
        this._date = date;
        this._raison = raison;
    }
    get id() {
        return this._id;
    }
    get cra() {
        return this._craId;
    }
    get matin() {
        return this._matin;
    }
    get date() {
        return this._date;
    }
    get raison() {
        return this._raison;
    }
}
exports.Absence = Absence;
//# sourceMappingURL=Absence.js.map