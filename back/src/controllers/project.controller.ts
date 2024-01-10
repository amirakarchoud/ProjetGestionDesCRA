import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProjectDto } from '@app/dtos/project.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProjectCode } from '@app/domain/model/project.code';
import { CollabEmail } from '@app/domain/model/collab.email';
import { CraApplication } from '@app/domain/application/cra.application';
import { mapProject, mapToDomain } from '@app/mappers/v2/project.mapper';

@ApiTags('Gestion des projets')
@Controller('project')
@UsePipes(new ValidationPipe({ transform: true }))
export class ProjectController {
  constructor(private readonly craApplication: CraApplication) {}

  @Post('add')
  @ApiOperation({
    summary: 'Ajouter un projet',
    description: 'Ajoute un nouveau projet.',
  })
  async addProject(@Body() createProjectDto: ProjectDto): Promise<ProjectDto> {
    const project = mapToDomain(createProjectDto);
    await this.craApplication.addProject(project);
    return mapProject(await this.craApplication.getProjectById(project.code));
  }

  @Get('all')
  @ApiOperation({
    summary: 'Liste de tous les projets',
    description: 'Récupère la liste de tous les projets enregistrés.',
  })
  async getProjects(): Promise<ProjectDto[]> {
    return (await this.craApplication.getAllProjects()).map((proj) =>
      mapProject(proj),
    );
  }

  @Get('user/:id')
  @ApiOperation({
    summary: "Liste de projets d'un utilisateur",
    description:
      "Récupère la liste des projets associés à l'email de l'utilisateur fourni.",
  })
  async getUserProjects(@Param('id') userId: string): Promise<ProjectDto[]> {
    return (
      await this.craApplication.getProjectsByUser(new CollabEmail(userId))
    ).map((value) => mapProject(value));
  }

  @Get('/:id')
  @ApiOperation({
    summary: "Détails d'un projet par code(id)",
    description:
      "Récupère les détails d'un projet en fonction de l'identifiant fourni.",
  })
  async getById(@Param('id') projectId: string): Promise<ProjectDto> {
    return mapProject(
      await this.craApplication.getProjectById(new ProjectCode(projectId)),
    );
  }

  @Put('update')
  @ApiOperation({
    summary: 'Mettre à jour un projet',
    description: "Met à jour les informations d'un projet.",
  })
  async updateProject(@Body() createProjectDto: ProjectDto): Promise<void> {
    const project = mapToDomain(createProjectDto);
    await this.craApplication.updateProject(project);
  }

  @Get('search/:id')
  @ApiOperation({
    summary: 'Recherche de projets par ID',
    description:
      "Effectue une recherche de projets en fonction de l'identifiant fourni.",
  })
  async getProjectsSearch(@Param('id') id: string): Promise<ProjectDto[]> {
    return (
      await this.craApplication.getProjectsLikeId(new ProjectCode(id))
    ).map((value) => mapProject(value));
  }

  @Post('desactivate/:id')
  @ApiOperation({
    summary: 'Desactiver un projet par code(id)',
    description: "Desactiver un projet en fonction de l'identifiant fourni.",
  })
  async desactivateProject(@Param('id') projectId: string): Promise<void> {
    await this.craApplication.desactivateProject(new ProjectCode(projectId));
  }
}
