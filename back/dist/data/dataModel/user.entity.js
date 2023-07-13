"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDB = void 0;
const Role_1 = require("../../domain/model/Role");
const typeorm_1 = require("typeorm");
const absence_entity_1 = require("./absence.entity");
const cra_entity_1 = require("./cra.entity");
const activity_entity_1 = require("./activity.entity");
const project_entity_1 = require("./project.entity");
let UserDB = exports.UserDB = class UserDB {
};
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], UserDB.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserDB.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('enum', { default: 'collab', enum: ['admin', 'collab'] }),
    __metadata("design:type", Number)
], UserDB.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => absence_entity_1.AbsenceDB, (absence) => absence.collab),
    __metadata("design:type", Array)
], UserDB.prototype, "absences", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => activity_entity_1.ActivityDB, (activity) => activity.collab),
    __metadata("design:type", Array)
], UserDB.prototype, "activities", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => project_entity_1.ProjectDB, (project) => project.collabs),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], UserDB.prototype, "projects", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cra_entity_1.CRADB, (cra) => cra.collab),
    __metadata("design:type", Array)
], UserDB.prototype, "cras", void 0);
exports.UserDB = UserDB = __decorate([
    (0, typeorm_1.Entity)('user')
], UserDB);
//# sourceMappingURL=user.entity.js.map