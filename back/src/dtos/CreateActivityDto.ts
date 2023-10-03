import { ApiProperty } from '@nestjs/swagger';
import { Percentage } from '@app/domain/percentage.type';
import { IsEmail, IsInt, IsISO8601 } from 'class-validator';

export class CreateActivityDto {
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
  projectId: string;
}
