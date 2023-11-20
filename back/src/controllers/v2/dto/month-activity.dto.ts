import { ActivityDto } from '@app/dtos/activity.dto';
import { AvailableDateDto } from '@app/dtos/available.date.dto';
import { Etat } from '@app/domain/model/etat.enum';
import { Status } from '@app/domain/model/Status';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { LocalDate } from '@js-joda/core';

export const ACTIVITY_YEAR_DESC = 'The year this report is related to.';
export const ACTIVITY_MONTH_DESC = 'The month this report is related to.';

export class MonthActivityDto {
  @ApiProperty({
    description: `The unique identifier of this month activity.
     It is a concatenation of month, year and user email.`,
    example: '12-2023-john.doe@proxym.fr',
  })
  id: string;

  @ApiProperty({
    description: `List of holidays related to this month.
    The list is fetched from https://calendrier.api.gouv.fr/jours-feries/metropole/`,
    type: [ActivityDto],
  })
  @Type(() => ActivityDto)
  holidays: ActivityDto[];

  @ApiProperty({
    description: `List of absences for this month and user.`,
    type: [ActivityDto],
  })
  absences: ActivityDto[];

  @ApiProperty({
    description: `List of reported project activities for this month and user.`,
    type: [ActivityDto],
  })
  activities: ActivityDto[];

  @ApiProperty({
    description:
      'List of available dates (time slots) that can be used for reporting',
    type: [AvailableDateDto],
  })
  availableDates: AvailableDateDto[];

  @ApiProperty({
    description: ACTIVITY_MONTH_DESC,
    examples: [1, 12],
    minimum: 1,
    maximum: 12,
  })
  month: number;

  @ApiProperty({
    description: ACTIVITY_YEAR_DESC,
    example: [2023],
    minimum: LocalDate.now().year(),
  })
  year: number;

  @ApiProperty({
    description: `The employee's email related to this activity report. Email`,
    example: 'john.doe@proxym.fr',
  })
  employee: string;

  @ApiProperty({
    description:
      'The current state of the month report. Submitted or un-submitted',
    examples: [Etat.submitted, Etat.unsubmitted],
    enum: Etat,
  })
  state: Etat;

  @ApiProperty()
  status: Status;

  @ApiProperty()
  history: any[];
}
