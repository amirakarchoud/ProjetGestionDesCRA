import { ProjetStatus } from '@app/domain/model/projetStatus.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
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
  date!: Date;
  constructor() {
    this.collabs = [];
  }
}
