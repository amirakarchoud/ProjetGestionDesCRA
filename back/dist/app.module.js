"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const craApplication_1 = require("./domain/application/craApplication");
const RepoCollab_1 = require("./data/Repository/RepoCollab");
const user_entity_1 = require("./data/dataModel/user.entity");
const absence_entity_1 = require("./data/dataModel/absence.entity");
const activity_entity_1 = require("./data/dataModel/activity.entity");
const cra_entity_1 = require("./data/dataModel/cra.entity");
const holiday_entity_1 = require("./data/dataModel/holiday.entity");
const project_entity_1 = require("./data/dataModel/project.entity");
const cra_service_1 = require("./domain/service/cra.service");
const cra_controller_1 = require("./controllers/cra.controller");
const RepoCra_1 = require("./data/Repository/RepoCra");
const RepoHoliday_1 = require("./data/Repository/RepoHoliday");
const schedule_1 = require("@nestjs/schedule");
const Project_controller_1 = require("./controllers/Project.controller");
const domain_module_1 = require("./domain/domain.module");
const RepoProject_1 = require("./data/Repository/RepoProject");
let AppModule = exports.AppModule = class AppModule {
};
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: 'root',
                password: '',
                database: 'test2',
                entities: [
                    __dirname + '/**/*.entity{.ts,.js}',
                ],
                synchronize: true,
            }), schedule_1.ScheduleModule.forRoot(), typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserDB, absence_entity_1.AbsenceDB, activity_entity_1.ActivityDB, cra_entity_1.CRADB, holiday_entity_1.HolidayDB, project_entity_1.ProjectDB]), domain_module_1.DoaminModule],
        controllers: [cra_controller_1.CraController, Project_controller_1.ProjectController],
        providers: [app_service_1.AppService, craApplication_1.CraApplication, cra_service_1.CraService,
            { provide: 'IRepoCollab', useClass: RepoCollab_1.RepoCollab }, { provide: 'IRepoCra', useClass: RepoCra_1.RepoCra },
            { provide: 'IRepoHoliday', useClass: RepoHoliday_1.RepoHoliday }, { provide: 'IRepoProject', useClass: RepoProject_1.RepoProject }]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map