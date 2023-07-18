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
exports.CraController = void 0;
const craApplication_1 = require("../domain/application/craApplication");
const CreateAbsenceDto_1 = require("../Dto/CreateAbsenceDto");
const common_1 = require("@nestjs/common");
const CreateActivityDto_1 = require("../Dto/CreateActivityDto");
let CraController = exports.CraController = class CraController {
    constructor(craApp) {
        this.craApp = craApp;
    }
    async addAbsence(createAbsenceDto) {
        console.log("adding absence back");
        return await this.craApp.addAbsence(createAbsenceDto);
    }
    async deleteAbsence(idCra, dateAbsence, matin) {
        return await this.craApp.deleteAbsence(idCra, dateAbsence, matin);
    }
    async addActivity(createActivityDto) {
        return await this.craApp.addActivity(createActivityDto);
    }
    async deleteActivity(idCra, dateActivity, matin) {
        return await this.craApp.deleteActivity(idCra, dateActivity, matin);
    }
    async getUserCra(idUser, month, year) {
        return await this.craApp.getCraByCollabMonthYear(idUser, month, year);
    }
    async submitCra(idCra) {
        return await this.craApp.submitCra(idCra);
    }
    async availableDates(idCra) {
        return await this.craApp.getEmptyDates(idCra);
    }
    async userYearCra(idUser, year) {
        return await this.craApp.userYearCra(idUser, year);
    }
};
__decorate([
    (0, common_1.Post)('absence'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateAbsenceDto_1.CreateAbsenceDto]),
    __metadata("design:returntype", Promise)
], CraController.prototype, "addAbsence", null);
__decorate([
    (0, common_1.Delete)('absence/:id/:date/:matin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('date')),
    __param(2, (0, common_1.Param)('matin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Date, Boolean]),
    __metadata("design:returntype", Promise)
], CraController.prototype, "deleteAbsence", null);
__decorate([
    (0, common_1.Post)('activity'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateActivityDto_1.CreateActivityDto]),
    __metadata("design:returntype", Promise)
], CraController.prototype, "addActivity", null);
__decorate([
    (0, common_1.Delete)('activity/:id/:date/:matin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('date')),
    __param(2, (0, common_1.Param)('matin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Date, Boolean]),
    __metadata("design:returntype", Promise)
], CraController.prototype, "deleteActivity", null);
__decorate([
    (0, common_1.Get)('get/:user/:month/:year'),
    __param(0, (0, common_1.Param)('user')),
    __param(1, (0, common_1.Param)('month')),
    __param(2, (0, common_1.Param)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], CraController.prototype, "getUserCra", null);
__decorate([
    (0, common_1.Get)('submt/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CraController.prototype, "submitCra", null);
__decorate([
    (0, common_1.Get)('availableDates/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CraController.prototype, "availableDates", null);
__decorate([
    (0, common_1.Get)('userYear/:id/:year'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], CraController.prototype, "userYearCra", null);
exports.CraController = CraController = __decorate([
    (0, common_1.Controller)('cra'),
    __metadata("design:paramtypes", [craApplication_1.CraApplication])
], CraController);
//# sourceMappingURL=cra.controller.js.map