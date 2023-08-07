import { Controller, Get } from '@nestjs/common';
import { CraApplication } from '../domain/application/craApplication';
import { Holiday } from '../domain/model/Holiday';
@Controller('holiday')
export class HolidayController {
  constructor(private readonly craApplication: CraApplication) {}

  @Get('all')
  async getHolidays(): Promise<Holiday[]> {
    return await this.craApplication.getAllHolidays();
  }
}
