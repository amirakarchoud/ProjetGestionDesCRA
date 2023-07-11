import { Project } from "../domain/model/Project";
import { IRepoCollab } from "../domain/IRepository/IRepoCollab";
import { Body, Controller, Get, Inject, Param, Post, Put } from "@nestjs/common";
import { CreateProjectDto } from "../Dto/CreateProjectDto";
import { CraApplication } from "../domain/application/craApplication";

@Controller('project')
export class ProjectController{
    constructor(private readonly craApplication:CraApplication) {}


    @Post('add')
    async addProject(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
       let project=new Project(createProjectDto.code,createProjectDto.collabs)
        return await this.craApplication.addProject(project);
      
    }

    @Get('all')
    async getProjects(): Promise<Project[]> {
        return await this.craApplication.getAllProjects();
      
    }


    @Get('user/:id')
    async getUserProjects(@Param('id') userId:string): Promise<Project[]> {
        return await this.craApplication.getProjectsByUser(userId);
      
    }

    @Get('/:id')
    async getById(@Param('id') projectId:string): Promise<Project> {
        return await this.craApplication.getProjectById(projectId);
      
    }


    @Put('update')
    async updateProject(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
       let project=new Project(createProjectDto.code,createProjectDto.collabs)
        return await this.craApplication.updateProject(project);
      
    }

}