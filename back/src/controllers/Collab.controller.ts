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

  @Post('ids')
  async getCollabsByIds(@Body() ids: string[]): Promise<Collab[]> {
    console.log('getting collabs back by ids');
    return await this.craApplication.getAllCollabsByIds(ids);
  }
}
