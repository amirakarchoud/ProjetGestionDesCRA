import { Percentage } from '../domain/percentage.type';
import { ProjectSimpleDto } from '@app/dtos/project.simple.dto';
import { Raison } from '@app/domain/model/Raison';

export enum ActivityDtoType {
  project = 'Project',
  holiday = 'Holiday',
  blank = 'Available',
}

export interface ActivityDto {
  title?: string; // raison ou project ou available
  percentage: Percentage;
  type: ActivityDtoType | Raison;
  date: Date;
  project?: ProjectSimpleDto;
}
