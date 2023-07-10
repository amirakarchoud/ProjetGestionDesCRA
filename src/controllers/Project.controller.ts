import { Project } from "../domain/model/Project";
import { IRepoCollab } from "../domain/IRepository/IRepoCollab";
import { Body, Controller, Inject, Post } from "@nestjs/common";
import { CreateProjectDto } from "../Dto/CreateProjectDto";

@Controller('project')
export class ProjectController{
    constructor(@Inject('IRepoCollab') private readonly repoCollab:IRepoCollab ) {}


    @Post('add')
    async addProject(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
        const collabs = await this.repoCollab.findByIds(createProjectDto.collabs);
       let project=new Project(createProjectDto.code,collabs)
        return this.repoCollab.addProject(project);
      
    }

}