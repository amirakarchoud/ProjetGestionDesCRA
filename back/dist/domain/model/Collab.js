"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collab = void 0;
class Collab {
    constructor(email, name, role) {
        this._cras = [];
        this._projects = [];
        this._activities = [];
        this._absences = [];
        this._name = name;
        this._email = email;
        this._role = role;
    }
    get email() {
        return this._email;
    }
    get role() {
        return this._role;
    }
    set role(role) {
        this._role = role;
    }
    addAbsence(arg0) {
        this._absences.push(arg0);
    }
    addActivity(arg0) {
        this._activities.push(arg0);
    }
    addProject(arg0) {
        this._projects.push(arg0);
    }
    get activities() {
        return this._activities;
    }
    get absences() {
        return this._absences;
    }
    get name() {
        return this._name;
    }
    get cras() {
        return this._cras;
    }
    get projects() {
        return this._projects;
    }
    set email(em) {
        this._email = em;
    }
}
exports.Collab = Collab;
//# sourceMappingURL=Collab.js.map