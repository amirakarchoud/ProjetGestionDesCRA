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
exports.ProjectController = void 0;
const Project_1 = require("../domain/model/Project");
const common_1 = require("@nestjs/common");
const CreateProjectDto_1 = require("../Dto/CreateProjectDto");
const craApplication_1 = require("../domain/application/craApplication");
let ProjectController = exports.ProjectController = class ProjectController {
    constructor(craApplication) {
        this.craApplication = craApplication;
    }
    async addProject(createProjectDto) {
        let project = new Project_1.Project(createProjectDto.code, createProjectDto.collabs);
        return await this.craApplication.addProject(project);
    }
    async getProjects() {
        console.log("getting projects back");
        return await this.craApplication.getAllProjects();
    }
    async getUserProjects(userId) {
        return await this.craApplication.getProjectsByUser(userId);
    }
    async getById(projectId) {
        return await this.craApplication.getProjectById(projectId);
    }
    async updateProject(createProjectDto) {
        let project = new Project_1.Project(createProjectDto.code, createProjectDto.collabs);
        return await this.craApplication.updateProject(project);
    }
};
__decorate([
    (0, common_1.Post)('add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateProjectDto_1.CreateProjectDto]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "addProject", null);
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getProjects", null);
__decorate([
    (0, common_1.Get)('user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getUserProjects", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getById", null);
__decorate([
    (0, common_1.Put)('update'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateProjectDto_1.CreateProjectDto]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "updateProject", null);
exports.ProjectController = ProjectController = __decorate([
    (0, common_1.Controller)('project'),
    __metadata("design:paramtypes", [craApplication_1.CraApplication])
], ProjectController);
//# sourceMappingURL=Project.controller.js.map