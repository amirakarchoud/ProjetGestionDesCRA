import { ApiProperty } from '@nestjs/swagger';

export class deleteActivityAbsenceDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  date: Date;
}
