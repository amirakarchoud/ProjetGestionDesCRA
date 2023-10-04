import { ProjetStatus } from '@app/domain/model/projetStatus.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsISO8601 } from 'class-validator';
import { ProjectSimpleDto } from '@app/dtos/project.simple.dto';

export class ProjectDto extends ProjectSimpleDto {
  @ApiProperty()
  collabs: string[];
  @ApiProperty()
  @IsISO8601()
  date?: Date;
  constructor() {
    super();
    this.collabs = [];
  }
}
