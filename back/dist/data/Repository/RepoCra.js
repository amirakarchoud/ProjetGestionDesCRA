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
exports.RepoCra = void 0;
const typeorm_1 = require("typeorm");
const cra_entity_1 = require("../dataModel/cra.entity");
const typeorm_2 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const CRA_1 = require("../../domain/model/CRA");
const user_entity_1 = require("../dataModel/user.entity");
const absence_entity_1 = require("../dataModel/absence.entity");
const activity_entity_1 = require("../dataModel/activity.entity");
const Absence_1 = require("../../domain/model/Absence");
const Collab_1 = require("../../domain/model/Collab");
const Activity_1 = require("../../domain/model/Activity");
const Project_1 = require("../../domain/model/Project");
const holiday_entity_1 = require("../dataModel/holiday.entity");
const Holiday_1 = require("../../domain/model/Holiday");
const project_entity_1 = require("../dataModel/project.entity");
let RepoCra = exports.RepoCra = class RepoCra {
    constructor(craRepository, collabRepository) {
        this.craRepository = craRepository;
        this.collabRepository = collabRepository;
    }
    async findByYearUser(collabid, year) {
        let foundcras = [];
        const cras = (await this.craRepository.find({ where: { collab: { email: collabid }, year }, relations: ['collab', 'activities', 'absences', 'holidays', 'activities.project'] }));
        let user = await this.collabRepository.findById(collabid);
        if (cras) {
            cras.forEach(cra => {
                let foundcra = new CRA_1.CRA(cra.id, cra.month, cra.year, user, cra.date, cra.etat);
                foundcra.collab.email = user.email;
                const craAbsences = cra.absences.map((abs) => {
                    const absf = new Absence_1.Absence(foundcra.id, abs.matin, abs.date, abs.raison);
                    return absf;
                });
                foundcra.absences = craAbsences;
                const craAact = cra.activities.map((abs) => {
                    const absf = new Activity_1.Activity(abs.id, new Collab_1.Collab(cra.collab.email, cra.collab.name, cra.collab.role), new Project_1.Project(abs.project.code, []), abs.matin, abs.date, foundcra);
                    return absf;
                });
                foundcra.activities = craAact;
                const craholiday = cra.holidays.map((abs) => {
                    const absf = new Holiday_1.Holiday(abs.id, abs.date, abs.name);
                    return absf;
                });
                foundcra.holidays = craholiday;
                foundcras.push(foundcra);
            });
        }
        return foundcras;
    }
    async findByMonthYearCollab(month, year, collabid) {
        const cra = (await this.craRepository.findOne({ where: { month, year, collab: { email: collabid } }, relations: ['collab', 'activities', 'absences', 'holidays', 'activities.project'] }));
        if (cra) {
            let user = await this.collabRepository.findById(cra.collab.email);
            let foundcra = new CRA_1.CRA(cra.id, cra.month, cra.year, user, cra.date, cra.etat);
            foundcra.collab.email = user.email;
            const craAbsences = cra.absences.map((abs) => {
                const absf = new Absence_1.Absence(foundcra.id, abs.matin, abs.date, abs.raison);
                return absf;
            });
            foundcra.absences = craAbsences;
            const craAact = cra.activities.map((abs) => {
                const absf = new Activity_1.Activity(abs.id, new Collab_1.Collab(cra.collab.email, cra.collab.name, cra.collab.role), new Project_1.Project(abs.project.code, []), abs.matin, abs.date, foundcra);
                return absf;
            });
            foundcra.activities = craAact;
            const craholiday = cra.holidays.map((abs) => {
                const absf = new Holiday_1.Holiday(abs.id, abs.date, abs.name);
                return absf;
            });
            foundcra.holidays = craholiday;
            return foundcra;
        }
        return null;
    }
    async findById(id) {
        const cra = (await this.craRepository.findOne({ where: { id }, relations: ['collab', 'activities', 'absences', 'activities.project', 'holidays'] }));
        let user = await this.collabRepository.findById(cra.collab.email);
        let found = new CRA_1.CRA(cra.id, cra.month, cra.year, user, cra.date, cra.etat);
        const craAbsences = cra.absences.map((abs) => {
            const absf = new Absence_1.Absence(found.id, abs.matin, abs.date, abs.raison);
            return absf;
        });
        found.absences = craAbsences;
        const craAact = cra.activities.map((abs) => {
            const absf = new Activity_1.Activity(abs.id, new Collab_1.Collab(cra.collab.email, cra.collab.name, cra.collab.role), new Project_1.Project(abs.project.code, []), abs.matin, abs.date, found);
            return absf;
        });
        found.activities = craAact;
        const craholiday = cra.holidays.map((abs) => {
            const absf = new Holiday_1.Holiday(abs.id, abs.date, abs.name);
            return absf;
        });
        found.holidays = craholiday;
        return found;
    }
    async save(cra) {
        const cradb = new cra_entity_1.CRADB();
        cradb.id = cra.id;
        cradb.month = cra.month;
        cradb.year = cra.year;
        cradb.collab = new user_entity_1.UserDB();
        cradb.collab.email = cra.collab.email;
        cradb.date = cra.date;
        cradb.etat = cra.etat;
        const craActivitiesDB = cra.activities.map((activity) => {
            const activityDB = new activity_entity_1.ActivityDB();
            activityDB.cra = new cra_entity_1.CRADB();
            activityDB.cra.id = cra.id;
            activityDB.id = activity.id;
            activityDB.date = activity.date;
            activityDB.collab = new user_entity_1.UserDB();
            activityDB.collab.email = cra.collab.email;
            activityDB.matin = activity.matin;
            activityDB.project = new project_entity_1.ProjectDB();
            activityDB.project.code = activity.project.code;
            return activityDB;
        });
        cradb.activities = craActivitiesDB;
        const craAbsencesDB = cra.absences.map((abs) => {
            const absdb = new absence_entity_1.AbsenceDB();
            absdb.id = abs.id;
            absdb.cra = new cra_entity_1.CRADB();
            absdb.cra.id = cra.id;
            absdb.date = abs.date;
            absdb.matin = abs.matin;
            absdb.collab = new user_entity_1.UserDB();
            absdb.collab.email = cra.collab.email;
            absdb.raison = abs.raison;
            return absdb;
        });
        cradb.absences = craAbsencesDB;
        const holidaydb = cra.holidays.map((hol) => {
            const holdb = new holiday_entity_1.HolidayDB();
            holdb.id = hol.id;
            holdb.date = hol.date;
            holdb.name = hol.name;
            return holdb;
        });
        cradb.holidays = holidaydb;
        await this.craRepository.save(cradb);
        return cra;
    }
    async findByCollab(collabid) {
        let foundcras = [];
        const cras = (await this.craRepository.find({ where: { collab: { email: collabid } }, relations: ['collab', 'activities', 'absences', 'holidays'] }));
        let user = await this.collabRepository.findById(collabid);
        if (cras) {
            cras.forEach(cra => {
                let foundcra = new CRA_1.CRA(cra.id, cra.month, cra.year, user, cra.date, cra.etat);
                foundcra.collab.email = user.email;
                const craAbsences = cra.absences.map((abs) => {
                    const absf = new Absence_1.Absence(foundcra.id, abs.matin, abs.date, abs.raison);
                    return absf;
                });
                foundcra.absences = craAbsences;
                const craAact = cra.activities.map((abs) => {
                    const absf = new Activity_1.Activity(abs.id, new Collab_1.Collab(cra.collab.email, cra.collab.name, cra.collab.role), new Project_1.Project(abs.project.code, []), abs.matin, abs.date, foundcra);
                    return absf;
                });
                foundcra.activities = craAact;
                const craholiday = cra.holidays.map((abs) => {
                    const absf = new Holiday_1.Holiday(abs.id, abs.date, abs.name);
                    return absf;
                });
                foundcra.holidays = craholiday;
                foundcras.push(foundcra);
            });
        }
        return foundcras;
    }
};
exports.RepoCra = RepoCra = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(cra_entity_1.CRADB)),
    __param(1, (0, common_1.Inject)('IRepoCollab')),
    __metadata("design:paramtypes", [typeorm_1.Repository, Object])
], RepoCra);
//# sourceMappingURL=RepoCra.js.map