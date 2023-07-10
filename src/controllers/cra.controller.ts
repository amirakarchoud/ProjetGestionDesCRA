import { CreateAbsenceDto } from "../Dto/CreateAbsenceDto";
import { Absence } from "../domain/model/Absence";
import { CraService } from "../domain/service/cra.service";
import { Body, Controller, Post } from "@nestjs/common";

@Controller('cra')
export class CraController{
    constructor(private readonly craService: CraService) {}
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

    @Post('activity')
    async addAbsence(@Body() createAbsenceDto: CreateAbsenceDto): Promise<Absence> {
       
        return this.craService.addAbsence(createAbsenceDto);
      
    }

}