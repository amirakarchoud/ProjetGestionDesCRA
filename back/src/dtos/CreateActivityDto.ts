import { ApiProperty } from '@nestjs/swagger';
import { Percentage } from '@app/domain/percentage.type';
import { IsDate, IsEmail, IsInt } from 'class-validator';

export class CreateActivityDto {
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
  projectId: string;
}
