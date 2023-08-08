import { CraApplication } from '@app/domain/application/craApplication';
import { Collab } from '@app/domain/model/Collab';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('collab')
export class CollabController {
  constructor(private readonly craApplication: CraApplication) {}

  @Get('all')
  async getCollabss(): Promise<Collab[]> {
    console.log('getting collabs back');
    return await this.craApplication.getAllCollabs();
  }

  @Get('ids')
  async getCollabsByIds(@Body() ids: string[]): Promise<Collab[]> {
    return await this.craApplication.getAllCollabsByIds(ids);
  }

  @Post('')
  async addCollab(@Body() collab: Collab): Promise<Collab> {
    return await this.craApplication.addCollab(collab);
  }
}
