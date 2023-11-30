import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString } from 'class-validator';
import { ProjectSimpleDto } from './project.simple.dto';

export class ProjectDto extends ProjectSimpleDto {
  @ApiProperty({
    description: 'List of collabs emails that this project is related to.',
    example: ['john.doe@proxym.fr'],
  })
  @IsString({
    each: true,
  })
  collabs: string[];

  @ApiProperty({
    description: 'The date this project is related to.',
    required: false,
  })
  @IsOptional()
  @IsISO8601({ strict: true })
  date?: string;

  constructor() {
    super();
    this.collabs = [];
  }
}
