import { CraApplication } from "../domain/application/craApplication";
import { CreateAbsenceDto } from "../Dto/CreateAbsenceDto";
import { Absence } from "../domain/model/Absence";
import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
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
    console.log("adding absence back");

    return await this.craApp.addAbsence(createAbsenceDto);

  }


  @Delete('absence')
  async deleteAbsence(@Body() delAbsenceDto:deleteActivityAbsenceDto)  {
    console.log("deleting absence");
    return await this.craApp.deleteAbsence(delAbsenceDto.id,new Date( delAbsenceDto.date), delAbsenceDto.matin);

  }

  @Post('activity')
  async addActivity(@Body() createActivityDto: CreateActivityDto): Promise<Activity> {
    
    return await this.craApp.addActivity(createActivityDto);

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