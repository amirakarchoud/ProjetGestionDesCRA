import { CraDto } from '@app/dtos/cra.dto';
import { CRA } from '@app/domain/model/CRA';
import { Activity } from '@app/domain/model/Activity';
import { ActivityDto, ActivityDtoType } from '@app/dtos/activity.dto';
import { AvailableDateDto } from '@app/dtos/available.date.dto';
import { Absence } from '@app/domain/model/Absence';
import { Project } from '@app/domain/model/Project';
import { ProjectSimpleDto } from '@app/dtos/project.simple.dto';
import { Holiday } from '@app/domain/model/Holiday';
import { convert, LocalDate } from '@js-joda/core';

export const mapCraToCraDto = (cra: CRA, projects: Project[]): CraDto => {
  return {
    id: cra.id,
    holidays: mapHolidaysDto(cra.holidays),
    absences: mapAbsencesDto(cra.absences),
    activites: mapActivitiesDto(cra.activities, projects),
    availableDates: mapAvailableDates(cra.getAvailableDatesOfCra(), cra),
    month: cra.month.value(),
    year: cra.year,
    collab: cra.collab.value,
    etat: cra.etat,
    status: cra.status,
    history: cra.history,
  };
};

function mapHolidaysDto(holidays: Holiday[]): ActivityDto[] {
  return holidays.map((holiday) => {
    return {
      title: holiday.name,
      percentage: 100,
      date: holiday.date.toString(),
      type: ActivityDtoType.holiday,
    };
  });
}

function mapAbsencesDto(absences: Absence[]): ActivityDto[] {
  return absences.map((abs) => {
    return {
      title: abs.raison,
      percentage: abs.percentage,
      type: ActivityDtoType.absence,
      date: abs.date.toString(),
      reason: abs.raison,
    };
  });
}
export const mapAvailableDates = (
  availableDatesOfCra: LocalDate[],
  cra: CRA,
): AvailableDateDto[] => {
  return availableDatesOfCra.map((availableDate) => {
    return {
      date: availableDate.toString(),
      availableTime: cra.getAvailableTime(availableDate),
    };
  });
};

export const mapActivitiesDto = (
  activities: Activity[],
  projects: Project[],
): ActivityDto[] => {
  return activities.map((act) => {
    const projectDto = new ProjectSimpleDto();
    const relatedProject = projects.find(
      (proj) => proj.code.value === act.project.value,
    );
    projectDto.code = relatedProject.code.value;
    projectDto.status = relatedProject.status;
    projectDto.name = relatedProject.name;
    projectDto.client = relatedProject.client;

    return {
      date: act.date.toString(),
      title: act.project.value,
      percentage: act.percentage,
      project: projectDto,
      type: ActivityDtoType.project,
    };
  });
};
