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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CraService = void 0;
const Absence_1 = require("../model/Absence");
const CRA_1 = require("../model/CRA");
const common_1 = require("@nestjs/common");
const etat_enum_1 = require("../model/etat.enum");
const Activity_1 = require("../model/Activity");
let CraService = exports.CraService = class CraService {
    constructor(repoCollab, repoCra, repoProject, repoHoliday) {
        this.repoCollab = repoCollab;
        this.repoCra = repoCra;
        this.repoProject = repoProject;
        this.repoHoliday = repoHoliday;
    }
    async deleteAbsence(id, date, matin) {
        const cra = await this.repoCra.findById(id);
        cra.deleteAbsence(date, matin);
        return await this.repoCra.save(cra);
    }
    async addAbsence(createAbsenceDto) {
        const dateAbs = new Date(createAbsenceDto.date);
        let user = await this.repoCollab.findById(createAbsenceDto.collabId);
        let cra = (await this.repoCra.findByMonthYearCollab(dateAbs.getMonth() + 1, dateAbs.getFullYear(), createAbsenceDto.collabId));
        if (!cra) {
            cra = new CRA_1.CRA(0, dateAbs.getMonth() + 1, dateAbs.getFullYear(), user, new Date(), etat_enum_1.Etat.unsubmitted);
            cra.holidays = await this.repoHoliday.findForCra(dateAbs.getMonth() + 1, dateAbs.getFullYear());
            await this.repoCra.save(cra);
        }
        cra = (await this.repoCra.findByMonthYearCollab(dateAbs.getMonth() + 1, dateAbs.getFullYear(), createAbsenceDto.collabId));
        const absence = new Absence_1.Absence(cra.id, createAbsenceDto.matin, createAbsenceDto.date, createAbsenceDto.raison);
        cra.addAbsence(absence);
        await this.repoCra.save(cra);
        return absence;
    }
    async deleteActivity(id, date, matin) {
        const cra = await this.repoCra.findById(id);
        cra.deleteActivity(date, matin);
        return await this.repoCra.save(cra);
    }
    async addActivity(createActivityDto) {
        const dateAct = new Date(createActivityDto.date);
        let user = await this.repoCollab.findById(createActivityDto.collabId);
        let project = await this.repoProject.findById(createActivityDto.projectId);
        let cra = (await this.repoCra.findByMonthYearCollab(dateAct.getMonth() + 1, dateAct.getFullYear(), createActivityDto.collabId));
        if (!cra) {
            cra = new CRA_1.CRA(0, dateAct.getMonth() + 1, dateAct.getFullYear(), user, new Date(), etat_enum_1.Etat.unsubmitted);
            cra.holidays = await this.repoHoliday.findForCra(dateAct.getMonth() + 1, dateAct.getFullYear());
            await this.repoCra.save(cra);
        }
        cra = (await this.repoCra.findByMonthYearCollab(dateAct.getMonth() + 1, dateAct.getFullYear(), createActivityDto.collabId));
        const activity = new Activity_1.Activity(cra.id, user, project, createActivityDto.matin, createActivityDto.date, cra);
        cra.addActivity(activity);
        await this.repoCra.save(cra);
        return activity;
    }
};
exports.CraService = CraService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IRepoCollab')),
    __param(1, (0, common_1.Inject)('IRepoCra')),
    __param(2, (0, common_1.Inject)('IRepoProject')),
    __param(3, (0, common_1.Inject)('IRepoHoliday')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], CraService);
//# sourceMappingURL=cra.service.js.map