import { Project } from "../domain/model/Project";
import { CreateProjectDto } from "../Dto/CreateProjectDto";
import { CraApplication } from "../domain/application/craApplication";
export declare class ProjectController {
    private readonly craApplication;
    constructor(craApplication: CraApplication);
    addProject(createProjectDto: CreateProjectDto): Promise<Project>;
    getProjects(): Promise<Project[]>;
    getUserProjects(userId: string): Promise<Project[]>;
    getById(projectId: string): Promise<Project>;
    updateProject(createProjectDto: CreateProjectDto): Promise<Project>;
}
