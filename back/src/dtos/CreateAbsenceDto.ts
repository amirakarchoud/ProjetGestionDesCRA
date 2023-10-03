import { ApiProperty } from '@nestjs/swagger';
import { Raison } from '../domain/model/Raison';
import { Percentage } from '@app/domain/percentage.type';
import { IsEmail, IsInt, IsISO8601 } from 'class-validator';

export class CreateAbsenceDto {
  @ApiProperty()
  @IsISO8601()
  date: Date;
  @ApiProperty()
  @IsInt()
  percentage: Percentage;
  @ApiProperty()
  @IsEmail()
  collabId: string;
  @ApiProperty()
  raison: Raison;
}
