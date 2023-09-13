import { CraApplication } from '@app/domain/application/craApplication';
import { Collab } from '@app/domain/model/Collab';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Collaborateur')
@Controller('collab')
export class CollabController {
  constructor(private readonly craApplication: CraApplication) {
  }

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
  async getCollabsByIds(@Query() params: string): Promise<Collab[]> {
    return await this.craApplication.getAllCollabsByIds(
      params['ids'].split(','),
    );
  }

  @Post('')
  @ApiOperation({
    summary: 'Ajouter un collaborateur',
    description: 'Ajoute un nouveau collaborateur.',
  })
  async addCollab(@Body() collab: Collab): Promise<Collab> {
    return await this.craApplication.addCollab(collab);
  }
}
