import { CraApplication } from "../domain/application/craApplication";
import { CreateAbsenceDto } from "../Dto/CreateAbsenceDto";
import { Absence } from "../domain/model/Absence";
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
import { CreateActivityDto } from "../Dto/CreateActivityDto";
import { Activity } from "../domain/model/Activity";
import { deleteActivityAbsenceDto } from "@app/Dto/deleteActivityAbsenceDto";

@Controller('cra')
export class CraController {
  constructor(private readonly craApp: CraApplication) { }
  /*
      @Post()
      async createCra(@Body() createCraDto: CreateCraDto): Promise<CRA> {
        try {
          const createdCra = await this.craService.createCra(createCraDto);
          return createdCra;
        } catch (error) {
          console.error('Error creating CRA:', error);
          throw new Error('Failed to create CRA');
        }
      }
      */

  @Post('absence')
  async addAbsence(@Body() createAbsenceDto: CreateAbsenceDto): Promise<Absence> {
    try {
      const result = await this.craApp.addAbsence(createAbsenceDto);
      return result;
    }  catch (error) {
      if (error.message.includes('it is a holiday')) {
        throw new HttpException({ message: "C'est un jour ferie!" }, HttpStatus.BAD_REQUEST);
      } else if (error.message === 'FULL day or period') {
        throw new HttpException({ message: "La journee est deja remplie" }, HttpStatus.BAD_REQUEST);
      } else if (error.message === 'Forbidden') {
        throw new HttpException({ message: "ce n'est pas le moment de dresser ce compte rendu" }, HttpStatus.FORBIDDEN);
      } else {
        throw new HttpException({ message: 'Internal server error' }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

  }


  @Delete('absence')
  async deleteAbsence(@Body() delAbsenceDto:deleteActivityAbsenceDto)  {
    console.log("deleting absence");
    return await this.craApp.deleteAbsence(delAbsenceDto.id,new Date( delAbsenceDto.date), delAbsenceDto.matin);

  }

  @Post('activity')
  async addActivity(@Body() createActivityDto: CreateActivityDto): Promise<Activity> {
    
    try {
      const result = await this.craApp.addActivity(createActivityDto);
      return result;
    } catch (error) {
      if (error.message.includes('it is a holiday')) {
        throw new HttpException({ message: "C'est un jour ferie!" }, HttpStatus.BAD_REQUEST);
      } else if (error.message === 'FULL day or period') {
        throw new HttpException({ message: "La journee est deja remplie" }, HttpStatus.BAD_REQUEST);
      } else if (error.message === 'Forbidden') {
        throw new HttpException({ message: "ce n'est pas le moment de dresser ce compte rendu" }, HttpStatus.FORBIDDEN);
      } else {
        throw new HttpException({ message: 'Internal server error' }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

  }


  @Delete('activity')
  async deleteActivity(@Body() delActivityDto:deleteActivityAbsenceDto) {
    console.log("deleting activity");
    return await this.craApp.deleteActivity(delActivityDto.id, delActivityDto.date, delActivityDto.matin);

  }

  @Get('get/:user/:month/:year')
  async getUserCra(@Param('user') idUser: string, @Param('month') month: number, @Param('year') year: number) {
    return await this.craApp.getCraByCollabMonthYear(idUser, month, year);
  }

  @Get('submt/:id')
  async submitCra(@Param('id') idCra: number) {
    return await this.craApp.submitCra(idCra);
  }

  @Get('availableDates/:id')
  async availableDates(@Param('id') idCra: number) {
    return await this.craApp.getEmptyDates(idCra);
  }


  @Get('userYear/:id/:year')
  async userYearCra(@Param('id') idUser: string, @Param('year') year: number) {
    return await this.craApp.userYearCra(idUser, year);
  }




}