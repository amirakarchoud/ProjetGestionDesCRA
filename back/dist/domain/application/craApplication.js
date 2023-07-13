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
exports.CraApplication = void 0;
const Collab_1 = require("../../domain/model/Collab");
const common_1 = require("@nestjs/common");
const Role_1 = require("../model/Role");
const cra_service_1 = require("../service/cra.service");
let CraApplication = exports.CraApplication = class CraApplication {
    constructor(collabRepository, projectRepository, craRepository, craService) {
        this.collabRepository = collabRepository;
        this.projectRepository = projectRepository;
        this.craRepository = craRepository;
        this.craService = craService;
    }
    async addUser(jwtToken) {
        console.log("craqpp add user");
        const collab = new Collab_1.Collab('test1', 'test', Role_1.Role.admin);
        console.log('collab' + collab.email);
        await this.collabRepository.save(collab);
    }
    async addProject(project) {
        return await this.projectRepository.save(project);
    }
    async getAllProjects() {
        return await this.projectRepository.findAll();
    }
    async updateProject(project) {
        return await this.projectRepository.update(project);
    }
    async getProjectById(id) {
        return await this.projectRepository.findById(id);
    }
    async deleteProject(id) {
        return await this.projectRepository.delete(id);
    }
    async getProjectsByUser(id) {
        return await this.projectRepository.findByUser(id);
    }
    async addAbsence(absence) {
        return await this.craService.addAbsence(absence);
    }
    async deleteAbsence(idCra, date, matin) {
        return await this.craService.deleteAbsence(idCra, date, matin);
    }
    async addActivity(activity) {
        return await this.craService.addActivity(activity);
    }
    async deleteActivity(idCra, date, matin) {
        return await this.craService.deleteActivity(idCra, date, matin);
    }
    async getCraByCollabMonthYear(idUser, month, year) {
        return await this.craRepository.findByMonthYearCollab(month, year, idUser);
    }
    async submitCra(idCra) {
        let cra = await this.craRepository.findById(idCra);
        cra.SubmitCra();
        return await this.craRepository.save(cra);
    }
    async getEmptyDates(idCra) {
        let cra = await this.craRepository.findById(idCra);
        return cra.getAvailableDatesOfCra();
    }
};
exports.CraApplication = CraApplication = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IRepoCollab')),
    __param(1, (0, common_1.Inject)('IRepoProject')),
    __param(2, (0, common_1.Inject)('IRepoCra')),
    __metadata("design:paramtypes", [Object, Object, Object, cra_service_1.CraService])
], CraApplication);
//# sourceMappingURL=craApplication.js.map