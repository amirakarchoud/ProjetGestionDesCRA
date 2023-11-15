import { ProjectActivitiesDto } from '@app/dtos/activity.dto';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class ActivityReportDto {
  @Type(() => ProjectActivitiesDto)
  @ValidateNested({ each: true })
  activities: ProjectActivitiesDto[];
  collabEmail: string;
  year: number;
  month: number;
}
