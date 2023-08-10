import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityDto {
  @ApiProperty()
  date: Date;
  @ApiProperty()
  matin: boolean;
  @ApiProperty()
  collabId: string;
  @ApiProperty()
  projectId: string;
}
