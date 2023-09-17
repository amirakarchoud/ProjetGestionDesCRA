import { ApiProperty } from '@nestjs/swagger';
import { Raison } from '../domain/model/Raison';

export class CreateAbsenceDto {
  @ApiProperty()
  date: Date;
  @ApiProperty()
  matin: boolean;
  @ApiProperty()
  collabId: string;
  @ApiProperty()
  raison: Raison;
}
