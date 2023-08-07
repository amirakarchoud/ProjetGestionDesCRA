import { CraApplication } from '../domain/application/craApplication';
import { CreateAbsenceDto } from '../Dto/CreateAbsenceDto';
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
import { CreateActivityDto } from '../Dto/CreateActivityDto';
import { Activity } from '../domain/model/Activity';
import { deleteActivityAbsenceDto } from '../Dto/deleteActivityAbsenceDto';
import { ExportService } from '@app/domain/service/export.service';
import { Response } from 'express';

@Controller('cra')
export class CraController {
  constructor(
    private readonly craApp: CraApplication,
    private readonly exportService: ExportService,
  ) {}
  @Post('absence')
  async addAbsence(
    @Body() createAbsenceDto: CreateAbsenceDto,
  ): Promise<Absence> {
    try {
      const result = await this.craApp.addAbsence(createAbsenceDto);
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

  @Post('absences')
  async addAbsences(@Body() createAbsencesDtos: CreateAbsenceDto[]) {
    for (const createAbsenceDto of createAbsencesDtos) {
      try {
        await this.craApp.addAbsence(createAbsenceDto);
      } catch (error) {
        throw new HttpException(
          { message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Delete('absence')
  async deleteAbsence(@Body() delAbsenceDto: deleteActivityAbsenceDto) {
    console.log('deleting absence');
    return await this.craApp.deleteAbsence(
      delAbsenceDto.id,
      new Date(delAbsenceDto.date),
      delAbsenceDto.matin,
    );
  }

  @Delete('absences')
  async deleteAbsences(@Body() delAbsencesDtos: deleteActivityAbsenceDto[]) {
    for (const delAbsenceDto of delAbsencesDtos) {
      await this.craApp.deleteAbsence(
        delAbsenceDto.id,
        new Date(delAbsenceDto.date),
        delAbsenceDto.matin,
      );
    }
  }

  @Post('activity')
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
  async addActivities(@Body() createActivitiesDtos: CreateActivityDto[]) {
    for (const createActivityDto of createActivitiesDtos) {
      try {
        await this.craApp.addActivity(createActivityDto);
      } catch (error) {
        throw new HttpException(
          { message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Delete('activity')
  async deleteActivity(@Body() delActivityDto: deleteActivityAbsenceDto) {
    console.log('deleting activity');
    return await this.craApp.deleteActivity(
      delActivityDto.id,
      delActivityDto.date,
      delActivityDto.matin,
    );
  }

  @Delete('activities')
  async deleteActivities(
    @Body() delActivitiesDtos: deleteActivityAbsenceDto[],
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
  async getUserCra(
    @Param('user') idUser: string,
    @Param('month') month: number,
    @Param('year') year: number,
  ) {
    console.log('getting user month cra back');
    return await this.craApp.getCraByCollabMonthYear(idUser, month, year);
  }

  @Post('submit/:id')
  async submitCra(@Param('id') idCra: number) {
    return await this.craApp.submitCra(idCra);
  }

  @Get('availableDates/:id')
  async availableDates(@Param('id') idCra: number) {
    return await this.craApp.getEmptyDates(idCra);
  }

  @Get('userYear/:id/:year')
  async userYearCra(@Param('id') idUser: string, @Param('year') year: number) {
    console.log('user cra by year');
    return await this.craApp.userYearCra(idUser, year);
  }

  @Get('monthCra/:month/:year')
  async getMonthCra(
    @Param('month') month: number,
    @Param('year') year: number,
  ) {
    return await this.craApp.getMonthCra(month, year);
  }

  @Get('closeCras/:month/:year')
  async closeAllMonthCra(
    @Param('month') month: number,
    @Param('year') year: number,
  ) {
    return await this.craApp.closeAllMonthCra(month, year);
  }

  @Get('export/:month/:year')
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
}
