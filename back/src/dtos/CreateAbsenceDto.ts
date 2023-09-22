import { ApiProperty } from '@nestjs/swagger';
import { Raison } from '../domain/model/Raison';
import { Percentage } from '@app/domain/percentage.type';

export class CreateAbsenceDto {
  @ApiProperty()
  date: Date;
  @ApiProperty()
  percentage: Percentage;
  @ApiProperty()
  collabId: string;
  @ApiProperty()
  raison: Raison;
}
