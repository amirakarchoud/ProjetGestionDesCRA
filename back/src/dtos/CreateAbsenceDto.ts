import { ApiProperty } from '@nestjs/swagger';
import { Raison } from '../domain/model/Raison';
import { Percentage } from '@app/domain/percentage.type';
import { IsDate, IsEmail, IsInt } from 'class-validator';

export class CreateAbsenceDto {
  @ApiProperty()
  @IsDate()
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
