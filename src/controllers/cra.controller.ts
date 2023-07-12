import { CraApplication } from "../domain/application/craApplication";
import { CreateAbsenceDto } from "../Dto/CreateAbsenceDto";
import { Absence } from "../domain/model/Absence";
import { CraService } from "../domain/service/cra.service";
import { Body, Controller, Delete, Param, Post } from "@nestjs/common";
import { CreateActivityDto } from "../Dto/CreateActivityDto";
import { Activity } from "../domain/model/Activity";

@Controller('cra')
export class CraController{
    constructor(private readonly craApp:CraApplication) {}
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
       
        return await this.craApp.addAbsence(createAbsenceDto);
      
    }

    
    @Delete('absence/:id/:date/:matin')
    async deleteAbsence(@Param('id')idCra:number,@Param('date')dateAbsence:Date,@Param('matin')matin:boolean) {
       
        return await this.craApp.deleteAbsence(idCra,dateAbsence,matin);
      
    }

    @Post('activity')
    async addActivity(@Body() createActivityDto: CreateActivityDto): Promise<Activity> {
       
        return await this.craApp.addActivity(createActivityDto);
      
    }

    
    @Delete('activity/:id/:date/:matin')
    async deleteActivity(@Param('id')idCra:number,@Param('date')dateActivity:Date,@Param('matin')matin:boolean) {
       
        return await this.craApp.deleteActivity(idCra,dateActivity,matin);
      
    }
    



}