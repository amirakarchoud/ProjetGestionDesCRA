import { Controller, Get } from '@nestjs/common';
import { CraApplication } from '../domain/application/craApplication';
import { Holiday } from '../domain/model/Holiday';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Jours feries')
@Controller('holiday')
export class HolidayController {
  constructor(private readonly craApplication: CraApplication) {}

  @Get('')
  @ApiOperation({
    summary: 'Récupérer toutes les vacances/jours feriés',
    description:
      'Récupère la liste de toutes les vacances/jours feriés enregistrées dans le système.',
  })
  async getHolidays(): Promise<Holiday[]> {
    return await this.craApplication.getAllHolidays();
  }
}
