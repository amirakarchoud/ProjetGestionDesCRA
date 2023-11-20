import { MonthActivityDto } from '@app/controllers/v2/dto/month-activity.dto';
import { Project } from '@app/domain/model/Project';
import { CRA } from '@app/domain/model/CRA';

import {
  mapAbsencesDto,
  mapActivitiesDto,
  mapAvailableDates,
  mapHolidaysDto,
} from '@app/mappers/cra-dto.mapper';

export const mapMonthActivityToCraDto = (
  cra: CRA,
  projects: Project[],
): MonthActivityDto => {
  return {
    id: cra.id,
    holidays: mapHolidaysDto(cra.holidays),
    absences: mapAbsencesDto(cra.absences),
    activities: mapActivitiesDto(cra.activities, projects),
    availableDates: mapAvailableDates(cra.getAvailableDatesOfCra(), cra),
    month: cra.month.value(),
    year: cra.year,
    employee: cra.collab.value,
    state: cra.etat,
    status: cra.status,
    history: cra.history,
  };
};
