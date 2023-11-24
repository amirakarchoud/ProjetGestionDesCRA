import { Collab } from '@app/domain/model/Collab';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CollabEmail } from '@app/domain/model/collab.email';
import { CraApplication } from '@app/domain/application/cra.application';

@ApiTags('Collaborateur')
@Controller('collab')
@UsePipes(new ValidationPipe({ transform: true }))
export class CollabController {
  constructor(private readonly craApplication: CraApplication) {}

  @Get('all')
  @ApiOperation({
    summary: 'Liste de tous les collaborateurs',
    description: 'Récupère la liste de tous les collaborateurs enregistrés.',
  })
  async getCollabs(): Promise<Collab[]> {
    return await this.craApplication.getAllCollabs();
  }

  @Get('ids')
  @ApiOperation({
    summary: 'Liste de collaborateurs par emails',
    description:
      'Récupère la liste des collaborateurs correspondant aux identifiants(email) fournis.',
  })
  async getCollabsByIds(@Query('ids') ids: string): Promise<Collab[]> {
    return await this.craApplication.getAllCollabsByIds(
      ids.split(',').map((id) => new CollabEmail(id)),
    );
  }

  @Post('')
  @ApiOperation({
    summary: 'Ajouter un collaborateur',
    description: 'Ajoute un nouveau collaborateur.',
  })
  async addCollab(@Body() collab: Collab): Promise<Collab> {
    await this.craApplication.addCollab(collab);
    const collabs = await this.craApplication.getAllCollabsByIds([
      collab.email,
    ]);
    return collabs.find((collab) => collab.email === collab.email);
  }
}
