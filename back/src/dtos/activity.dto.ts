import { IsISO8601, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Percentage } from '../domain/percentage.type';
import { ProjectSimpleDto } from '@app/dtos/project.simple.dto';
import { Raison } from '@app/domain/model/Raison';

export enum ActivityDtoType {
  project = 'Project',
  holiday = 'Holiday',
  absence = 'Absence',
  blank = 'Available',
}

export class ActivityDto {
  title?: string; // raison ou project ou available
  percentage: Percentage;
  type: ActivityDtoType;
  @IsISO8601()
  date: string;
  project?: ProjectSimpleDto;
  reason?: Raison;
}

export class ProjectActivitiesDto {
  projectCode: string;
  @Type(() => ActivityDto)
  @ValidateNested({ each: true })
  activities: ActivityDto[];
}
