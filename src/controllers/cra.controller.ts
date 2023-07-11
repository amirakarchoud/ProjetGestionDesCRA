import { CraApplication } from "../domain/application/craApplication";
import { CreateAbsenceDto } from "../Dto/CreateAbsenceDto";
import { Absence } from "../domain/model/Absence";
import { CraService } from "../domain/service/cra.service";
import { Body, Controller, Delete, Param, Post } from "@nestjs/common";

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

    /*
    @Delete('absence/:id')
    async deleteAbsence(@Param('id')idAbsence:number): Promise<Absence> {
       
        return await this.craApp.addAbsence();
      
    }
    */



}