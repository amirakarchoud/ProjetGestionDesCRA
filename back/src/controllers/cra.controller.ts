import { CraApplication } from '../domain/application/craApplication';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CollabEmail } from '@app/domain/model/collab.email';
import { CraDto } from '@app/dtos/cra.dto';
import { mapCraToCraDto } from '@app/mappers/cra-dto.mapper';
import { ActivityDtoType, ProjectActivitiesDto } from '@app/dtos/activity.dto';
import { CreateActivityDto } from '@app/dtos/CreateActivityDto';
import { CreateAbsenceDto } from '@app/dtos/CreateAbsenceDto';
import { Raison } from '@app/domain/model/Raison';

//@UseGuards(AuthGuard)
@ApiTags('Gestion des cra')
@Controller('cra')
export class CraController {
  constructor(private readonly craApp: CraApplication) {}

  @Post('/cra/user/:userid')
  @ApiOperation({
    summary: 'Week activities',
    description:
      'Post multiple CRA days with for multiple projects. Usually for an entire week',
  })
  async postWeek(
    @Param('userId') collabEmail: string,
    @Body() activities: ProjectActivitiesDto[],
  ) {
    for (const projectActivity of activities) {
      const projectCode = projectActivity.projectCode;

      for (const activityDto of projectActivity.activities) {
        if (activityDto.type === ActivityDtoType.project) {
          const createActivityDto = new CreateActivityDto();
          createActivityDto.collabId = collabEmail;
          createActivityDto.date = activityDto.date;
          createActivityDto.percentage = activityDto.percentage;
          createActivityDto.projectId = projectCode;

          await this.craApp.addActivity(createActivityDto);
        } else if (activityDto.type === ActivityDtoType.absence) {
          const absence: CreateAbsenceDto = new CreateAbsenceDto();
          absence.date = activityDto.date;
          absence.raison = Raison[activityDto.title];
          absence.percentage = activityDto.percentage;
          absence.collabId = collabEmail;

          await this.craApp.addAbsence(absence);
        }
      }
    }
  }

  @Get('get/:user/:month/:year')
  @ApiOperation({
    summary: "CRA du mois d'un utilisateur",
    description:
      "Récupère les comptes rendus d'activité (CRA) d'un utilisateur pour un mois donné (et année).",
  })
  async getUserCra(
    @Param('user') idUser: string,
    @Param('month') month: number,
    @Param('year') year: number,
  ): Promise<CraDto> {
    const projects = await this.craApp.getAllProjects();
    const cra = await this.craApp.getCraByCollabMonthYear(
      new CollabEmail(idUser),
      month,
      year,
    );

    return mapCraToCraDto(cra, projects);
  }

  @Post('submit/:id')
  @ApiOperation({
    summary: 'Soumettre un CRA',
    description:
      "Soumet le compte rendu d'activité avec l'ID spécifié. La soumission n'est possible que si le compte rendu est entièrement rempli, c'est-à-dire s'il n'y a pas de jours vides ",
  })
  async submitCra(@Param('id') idCra: string) {
    return await this.craApp.submitCra(idCra);
  }

  @Get('availableDates/:id')
  @ApiOperation({
    summary: 'Récupère les dates disponibles',
    description:
      "Récupère les dates disponibles pour un compte rendu d'activité (CRA) avec l'ID spécifié. Donc les jours encore vides. Les jours feries non comptés",
  })
  async availableDates(@Param('id') idCra: string) {
    return await this.craApp.getEmptyDates(idCra);
  }

  @Get('userYear/:id/:year')
  @ApiOperation({
    summary: "CRA d'un utilisateur par année",
    description:
      "Récupère tous les comptes rendus d'activité (CRA) d'un utilisateur pour une année donnée.",
  })
  async userYearCra(
    @Param('id') idUser: string,
    @Param('year') year: number,
  ): Promise<CraDto[]> {
    console.log('user cra by year');
    const cras = await this.craApp.userYearCra(new CollabEmail(idUser), year);
    const projects = await this.craApp.getAllProjects();
    return cras.map((cra) => mapCraToCraDto(cra, projects));
  }

  @Get('monthCra/:month/:year')
  @ApiOperation({
    summary: 'CRA du mois',
    description:
      "Récupère tous les comptes rendus d'activité de tous les collaborateurs pour un mois donnée.",
  })
  async getMonthCra(
    @Param('month') month: number,
    @Param('year') year: number,
  ): Promise<CraDto[]> {
    const cras = await this.craApp.getMonthCra(month, year);
    const projects = await this.craApp.getAllProjects();
    return cras.map((cra) => mapCraToCraDto(cra, projects));
  }

  @Post('closeCras/:month/:year')
  @ApiOperation({
    summary: 'Clôturer les CRA du mois',
    description:
      "Clôture tous les comptes rendus d'activité (CRA) pour un mois et une année donnés. permet de créer une regularisation apres chaque future modification du CRA",
  })
  async closeAllMonthCra(
    @Param('month') month: number,
    @Param('year') year: number,
  ) {
    return await this.craApp.closeAllMonthCra(month, year);
  }
}
