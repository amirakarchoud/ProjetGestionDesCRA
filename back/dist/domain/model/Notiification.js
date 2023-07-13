"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
class Notification {
    constructor(collab, description, date) {
        this._collab = collab;
        this._date = date;
        this._description = description;
    }
    get collab() {
        return this._collab;
    }
    get date() {
        return this._date;
    }
    get description() {
        return this._description;
    }
}
exports.Notification = Notification;
//# sourceMappingURL=Notiification.js.map