"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
class Project {
    toJSON() {
        return {
            code: this._code
        };
    }
    constructor(code, collabs) {
        this._collabs = [];
        this._activities = [];
        this._code = code;
        this._collabs = collabs;
    }
    addCollab(collab) {
        this._collabs.push(collab);
    }
    get collabs() {
        return this._collabs;
    }
    get code() {
        return this._code;
    }
    get activities() {
        return this._activities;
    }
}
exports.Project = Project;
//# sourceMappingURL=Project.js.map