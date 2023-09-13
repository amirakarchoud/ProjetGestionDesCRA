import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityDto {
  @ApiProperty()
  date: Date;
  @ApiProperty()
  percentage: number;
  @ApiProperty()
  collabId: string;
  @ApiProperty()
  projectId: string;
}
