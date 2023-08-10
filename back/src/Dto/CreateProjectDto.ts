import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty()
  code: string;
  @ApiProperty()
  collabs: string[];
  constructor() {
    this.collabs = [];
  }
}
