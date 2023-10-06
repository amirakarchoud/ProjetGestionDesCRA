import { Percentage } from '../domain/percentage.type';
import { ProjectSimpleDto } from '@app/dtos/project.simple.dto';
import { Raison } from '@app/domain/model/Raison';

export enum ActivityDtoType {
  project = 'Project',
  holiday = 'Holiday',
  absence = 'Absence',
  blank = 'Available',
}

export interface ActivityDto {
  title?: string; // raison ou project ou available
  percentage: Percentage;
  type: ActivityDtoType | Raison;
  date: Date;
  project?: ProjectSimpleDto;
}

export interface ProjectActivitiesDto {
  projectCode: string;
  activities: ActivityDto[];
}
