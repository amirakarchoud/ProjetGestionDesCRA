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
exports.AbsenceDB = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const Raison_1 = require("../../domain/model/Raison");
const cra_entity_1 = require("./cra.entity");
let AbsenceDB = exports.AbsenceDB = class AbsenceDB {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AbsenceDB.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], AbsenceDB.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], AbsenceDB.prototype, "matin", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserDB),
    __metadata("design:type", user_entity_1.UserDB)
], AbsenceDB.prototype, "collab", void 0);
__decorate([
    (0, typeorm_1.Column)('enum', { default: 'conges', enum: ['rtt', 'conges', 'maladie'] }),
    __metadata("design:type", Number)
], AbsenceDB.prototype, "raison", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cra_entity_1.CRADB, cra => cra.absences),
    __metadata("design:type", cra_entity_1.CRADB)
], AbsenceDB.prototype, "cra", void 0);
exports.AbsenceDB = AbsenceDB = __decorate([
    (0, typeorm_1.Entity)('absence')
], AbsenceDB);
//# sourceMappingURL=absence.entity.js.map