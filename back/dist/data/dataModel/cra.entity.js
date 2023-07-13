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
exports.CRADB = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const etat_enum_1 = require("../../domain/model/etat.enum");
const absence_entity_1 = require("./absence.entity");
const activity_entity_1 = require("./activity.entity");
const holiday_entity_1 = require("./holiday.entity");
let CRADB = exports.CRADB = class CRADB {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CRADB.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], CRADB.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CRADB.prototype, "month", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CRADB.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CRADB.prototype, "etat", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserDB),
    __metadata("design:type", user_entity_1.UserDB)
], CRADB.prototype, "collab", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => absence_entity_1.AbsenceDB, (absence) => absence.cra, { cascade: true }),
    __metadata("design:type", Array)
], CRADB.prototype, "absences", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => activity_entity_1.ActivityDB, (activity) => activity.cra, { cascade: true }),
    __metadata("design:type", Array)
], CRADB.prototype, "activities", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => holiday_entity_1.HolidayDB, (holiday) => holiday.cras),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], CRADB.prototype, "holidays", void 0);
exports.CRADB = CRADB = __decorate([
    (0, typeorm_1.Entity)('cra')
], CRADB);
//# sourceMappingURL=cra.entity.js.map