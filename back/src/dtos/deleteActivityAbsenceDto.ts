import { ApiProperty } from '@nestjs/swagger';

export class DeleteActivityAbsenceDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  date: Date;
  @ApiProperty()
  matin: boolean;
}
