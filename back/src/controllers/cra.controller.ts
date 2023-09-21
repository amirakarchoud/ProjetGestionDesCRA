import { CraApplication } from '../domain/application/craApplication';
import { CreateAbsenceDto } from '@app/dtos/CreateAbsenceDto';
import { Absence } from '../domain/model/Absence';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { CreateActivityDto } from '@app/dtos/CreateActivityDto';
import { Activity } from '../domain/model/Activity';
import { DeleteActivityAbsenceDto } from '@app/dtos/deleteActivityAbsenceDto';
import { ExportService } from '@app/domain/service/export.service';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CollabEmail } from '@app/domain/model/collab.email';

//@UseGuards(AuthGuard)
@ApiTags('Gestion des cra')
@Controller('cra')
export class CraController {
  constructor(
    private readonly craApp: CraApplication,
    private readonly exportService: ExportService,
  ) {}
  @Post('absence')
  @ApiOperation({
    summary: 'Ajouter une seule absence',
    description: 'Ajoute une nouvelle absence .',
  })
  async addAbsence(
    @Body() createAbsenceDto: CreateAbsenceDto,
  ): Promise<Absence> {
    try {
      return await this.craApp.addAbsence(createAbsenceDto);
    } catch (error) {
      if (error.message.includes('it is a holiday')) {
        throw new HttpException(
          { message: "C'est un jour ferie!" },
          HttpStatus.BAD_REQUEST,
        );
      } else if (error.message === 'FULL day or period') {
        throw new HttpException(
          { message: 'La journee est deja remplie' },
          HttpStatus.BAD_REQUEST,
        );
      } else if (error.message === 'Forbidden') {
        throw new HttpException(
          { message: "ce n'est pas le moment de dresser ce compte rendu" },
          HttpStatus.FORBIDDEN,
        );
      } else {
        throw new HttpException(
          { message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Post('absences')
  @ApiOperation({
    summary: 'Ajouter des absences',
    description: 'Ajoute plusieurs absences à la base de données en lot.',
  })
  async addAbsences(@Body() createAbsencesDtos: CreateAbsenceDto[]) {
    for (const createAbsenceDto of createAbsencesDtos) {
      try {
        await this.craApp.addAbsence(createAbsenceDto);
      } catch (error) {
        if (error.message.includes('it is a holiday')) {
          continue;
        } else {
          throw new HttpException(
            { message: 'Internal server error' },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    }
  }

  @Delete('absence')
  @ApiOperation({
    summary: 'Supprimer une seule absence',
    description: 'Supprimer une seule absence de la base de données.',
  })
  async deleteAbsence(@Body() delAbsenceDto: DeleteActivityAbsenceDto) {
    console.log('deleting absence');
    return await this.craApp.deleteAbsence(
      delAbsenceDto.id,
      new Date(delAbsenceDto.date),
      delAbsenceDto.matin,
    );
  }

  @Delete('absences')
  @ApiOperation({
    summary: 'Supprimer des absences en lot',
    description: 'Supprimer plusieurs absences de la base de données en lot.',
  })
  async deleteAbsences(@Body() delAbsencesDtos: DeleteActivityAbsenceDto[]) {
    for (const delAbsenceDto of delAbsencesDtos) {
      await this.craApp.deleteAbsence(
        delAbsenceDto.id,
        new Date(delAbsenceDto.date),
        delAbsenceDto.matin,
      );
    }
  }

  @Post('activity')
  @ApiOperation({
    summary: 'Ajouter une seule activite',
    description: 'Ajoute une nouvelle activite .',
  })
  async addActivity(
    @Body() createActivityDto: CreateActivityDto,
  ): Promise<Activity> {
    try {
      const result = await this.craApp.addActivity(createActivityDto);
      return result;
    } catch (error) {
      if (error.message.includes('it is a holiday')) {
        throw new HttpException(
          { message: "C'est un jour ferie!" },
          HttpStatus.BAD_REQUEST,
        );
      } else if (error.message === 'FULL day or period') {
        throw new HttpException(
          { message: 'La journee est deja remplie' },
          HttpStatus.BAD_REQUEST,
        );
      } else if (error.message === 'Forbidden') {
        throw new HttpException(
          { message: "ce n'est pas le moment de dresser ce compte rendu" },
          HttpStatus.FORBIDDEN,
        );
      } else {
        throw new HttpException(
          { message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Post('activities')
  @ApiOperation({
    summary: 'Ajouter des activites',
    description: 'Ajoute plusieurs activites à la base de données en lot.',
  })
  async addActivities(@Body() createActivitiesDtos: CreateActivityDto[]) {
    for (const createActivityDto of createActivitiesDtos) {
      try {
        await this.craApp.addActivity(createActivityDto);
      } catch (error) {
        if (error.message.includes('it is a holiday')) {
          continue;
        } else {
          throw new HttpException(
            { message: 'Internal server error' },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    }
  }

  @Delete('activity')
  @ApiOperation({
    summary: 'Supprimer une seule activite',
    description: 'Supprimer une seule activite de la base de données.',
  })
  async deleteActivity(@Body() delActivityDto: DeleteActivityAbsenceDto) {
    console.log('deleting activity');
    return await this.craApp.deleteActivity(
      delActivityDto.id,
      delActivityDto.date,
      delActivityDto.matin,
    );
  }

  @Delete('activities')
  @ApiOperation({
    summary: 'Supprimer des activites en lot',
    description: 'Supprimer plusieurs activites de la base de données en lot.',
  })
  async deleteActivities(
    @Body() delActivitiesDtos: DeleteActivityAbsenceDto[],
  ) {
    for (const delActivityDto of delActivitiesDtos) {
      await this.craApp.deleteActivity(
        delActivityDto.id,
        delActivityDto.date,
        delActivityDto.matin,
      );
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
  ) {
    return await this.craApp.getCraByCollabMonthYear(
      new CollabEmail(idUser),
      month,
      year,
    );
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
  async userYearCra(@Param('id') idUser: string, @Param('year') year: number) {
    console.log('user cra by year');
    return await this.craApp.userYearCra(new CollabEmail(idUser), year);
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
  ) {
    return await this.craApp.getMonthCra(month, year);
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

  @Get('export/:month/:year')
  @ApiOperation({
    summary: 'Exporter en Excel',
    description:
      "Exporte les données des comptes rendus d'activité (CRA) au format Excel pour un mois et une année donnés.",
  })
  async exportToExcel(
    @Res() res: Response,
    @Param('month') month: number,
    @Param('year') year: number,
  ) {
    try {
      const buffer = await this.exportService.generateExcel(month, year);
      const filename = 'Recap_Du_Mois.xlsx';

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

      res.status(HttpStatus.OK).send(buffer);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error generating Excel file' });
    }
  }

  @Get('export2/:month/:year')
  @ApiOperation({
    summary: 'Exporter en Excel',
    description:
      "Exporte les données des comptes rendus d'activité (CRA) au format Excel pour un mois et une année donnés.",
  })
  async exportToExcel2(
    @Res() res: Response,
    @Param('month') month: number,
    @Param('year') year: number,
  ) {
    try {
      const buffer = await this.exportService.generateExcel2(month, year);
      const filename = 'Recap_Du_Mois.xlsx';

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

      res.status(HttpStatus.OK).send(buffer);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error generating Excel file' });
    }
  }
}
