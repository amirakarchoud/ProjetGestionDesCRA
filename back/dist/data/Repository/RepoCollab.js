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
exports.RepoCollab = void 0;
const common_1 = require("@nestjs/common");
const Collab_1 = require("../../domain/model/Collab");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_entity_1 = require("../dataModel/user.entity");
let RepoCollab = exports.RepoCollab = class RepoCollab {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findById(id) {
        const user = (await this.userRepository.findOne({ where: { email: id } }));
        return new Collab_1.Collab(user.email, user.name, user.role);
    }
    async findAll() {
        let collabs;
        (await this.userRepository.find()).map(user => { collabs.push(new Collab_1.Collab(user.email, user.name, user.role)); });
        return collabs;
    }
    async save(user) {
        const collab = new user_entity_1.UserDB();
        console.log('here' + user.email);
        collab.email = user.email;
        collab.name = user.name;
        collab.role = user.role;
        console.log('role ' + user.role);
        await this.userRepository.save(collab);
        return user;
    }
    async findByIds(ids) {
        let collabs = [];
        const users = (await this.userRepository.findBy({ email: (0, typeorm_1.In)(ids) })).map(user => { collabs.push(new Collab_1.Collab(user.email, user.name, user.role)); });
        ;
        if (users) {
            return collabs;
        }
        return null;
    }
};
exports.RepoCollab = RepoCollab = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.UserDB)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], RepoCollab);
//# sourceMappingURL=RepoCollab.js.map