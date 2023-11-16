import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601 } from 'class-validator';
import { ProjectSimpleDto } from '@app/dtos/project.simple.dto';

export class ProjectDto extends ProjectSimpleDto {
  @ApiProperty()
  collabs: string[];
  @ApiProperty()
  @IsISO8601()
  date?: string;
  constructor() {
    super();
    this.collabs = [];
  }
}
