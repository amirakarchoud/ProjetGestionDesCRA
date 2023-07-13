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
exports.RepoProject = void 0;
const Project_1 = require("../../domain/model/Project");
const project_entity_1 = require("../dataModel/project.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../dataModel/user.entity");
let RepoProject = exports.RepoProject = class RepoProject {
    constructor(projectRepository) {
        this.projectRepository = projectRepository;
    }
    async findById(id) {
        const projectDB = await this.projectRepository.findOne({
            where: { code: id },
            relations: ['collabs'],
        });
        if (!projectDB) {
            throw new Error('Project not found');
        }
        const collabs = projectDB.collabs.map((collab) => collab.email);
        return new Project_1.Project(projectDB.code, collabs);
    }
    async findAll() {
        const projectsDB = await this.projectRepository.find({ relations: ['collabs'] });
        return projectsDB.map((projectDB) => {
            const collabs = projectDB.collabs.map((collab) => collab.email);
            return new Project_1.Project(projectDB.code, collabs);
        });
    }
    async save(project) {
        const projectDB = new project_entity_1.ProjectDB();
        projectDB.code = project.code;
        const collabs = [];
        for (const email of project.collabs) {
            const collab = new user_entity_1.UserDB();
            collab.email = email;
            collabs.push(collab);
        }
        projectDB.collabs = collabs;
        const savedProject = await this.projectRepository.save(projectDB);
        const savedCollabs = savedProject.collabs.map((collab) => collab.email);
        return project;
    }
    async delete(id) {
        await this.projectRepository.delete(id);
    }
    async update(updatedProject) {
        const project = await this.projectRepository.findOne({ where: { code: updatedProject.code } });
        if (!project) {
            throw new Error('Project not found');
        }
        project.code = updatedProject.code;
        const collabs = [];
        for (const email of updatedProject.collabs) {
            const collab = new user_entity_1.UserDB();
            collab.email = email;
            collabs.push(collab);
        }
        project.collabs = collabs;
        const updatedProjectDB = await this.projectRepository.save(project);
        return new Project_1.Project(updatedProjectDB.code, updatedProject.collabs);
    }
    async findByUser(idUser) {
        const projectsDB = await this.projectRepository.find({ relations: ['collabs'] });
        const filteredProjects = projectsDB.filter((projectDB) => projectDB.collabs.some((collab) => collab.email === idUser));
        return filteredProjects.map((projectDB) => {
            const collabs = projectDB.collabs.map((collab) => collab.email);
            return new Project_1.Project(projectDB.code, collabs);
        });
    }
};
exports.RepoProject = RepoProject = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.ProjectDB)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RepoProject);
//# sourceMappingURL=RepoProject.js.map