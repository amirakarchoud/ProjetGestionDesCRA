import { ApiProperty } from '@nestjs/swagger';
import { Percentage } from '@app/domain/percentage.type';

export class CreateActivityDto {
  @ApiProperty()
  date: Date;
  @ApiProperty()
  percentage: Percentage;
  @ApiProperty()
  collabId: string;
  @ApiProperty()
  projectId: string;
}
