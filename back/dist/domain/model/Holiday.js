"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Holiday = void 0;
class Holiday {
    constructor(id, date, name) {
        this._id = id;
        this._date = date;
        this._name = name;
    }
    get date() {
        return this._date;
    }
    get name() {
        return this._name;
    }
    get id() {
        return this._id;
    }
}
exports.Holiday = Holiday;
//# sourceMappingURL=Holiday.js.map