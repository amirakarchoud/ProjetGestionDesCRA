import { ProjectStatus } from '../domain/model/projetStatus.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectSimpleDto {
  @ApiProperty()
  code: string;

  @ApiProperty({
    description: 'The name of this project.',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'The client this project is for.',
    required: false,
  })
  client?: string;

  @ApiProperty({
    description: 'The status of this project.',
    enum: ProjectStatus,
    required: false,
  })
  status?: ProjectStatus;
}
