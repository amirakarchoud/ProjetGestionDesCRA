import { ProjetStatus } from '@app/domain/model/projetStatus.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectSimpleDto {
  @ApiProperty()
  code: string;
  @ApiProperty()
  name?: string;
  @ApiProperty()
  client?: string;
  @ApiProperty()
  status?: ProjetStatus;
}
