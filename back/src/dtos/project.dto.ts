import { ProjetStatus } from '@app/domain/model/projetStatus.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';

export class ProjectDto {
  @ApiProperty()
  code: string;
  @ApiProperty()
  collabs: string[];
  @ApiProperty()
  name: string;
  @ApiProperty()
  client: string;
  @ApiProperty()
  status: ProjetStatus;
  @ApiProperty()
  @IsDate()
  date?: Date;
  constructor() {
    this.collabs = [];
  }
}
