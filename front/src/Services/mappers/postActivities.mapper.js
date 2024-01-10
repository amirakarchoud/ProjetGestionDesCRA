import { ActivityTypeValues } from '../../Components/const/ActivityReport.constant';
import { DateTimeFormatter } from '@js-joda/core';

/**
 *
 * @param activities {ActivitiesType}
 * @param employeeEmail {string}
 * @param month {number}
 * @param year {number}
 * @return {{activities: {absences: {date: string, percentage: number, reason: Absences}[], projects: {date: string; percentage: number; project: {code: string;}}[]}[]; employeeEmail: string; month: number; year: number; replace: boolean;}}
 */
export const postActivitiesMapper = (
  activities,
  employeeEmail,
  month,
  year,
) => {
  return {
    activities: [
      {
        absences: mapAbsences(
          activities.filter((a) => a.type === ActivityTypeValues.Absence),
        ),
        projects: mapProjects(
          activities.filter((a) => a.type === ActivityTypeValues.Project),
        ),
      },
    ],
    employeeEmail,
    month,
    replace: true,
    year,
  };
};

/**
 *
 * @param absences {AbsenceActivityType[]}
 * @return {{date: string; percentage: number; reason: Absences}[]}
 */
function mapAbsences(absences) {
  return absences.map((a) => {
    const { code, date, percentage } = a;
    return {
      date: date.format(DateTimeFormatter.ISO_LOCAL_DATE),
      percentage,
      reason: code,
    };
  });
}

/**
 *
 * @param projects {[]}
 * @return {{date: string; percentage: number; project: {code: string;}}[]}
 */
function mapProjects(projects) {
  return projects.map((p) => {
    const { code, date, percentage } = p;
    return {
      date: date.format(DateTimeFormatter.ISO_LOCAL_DATE),
      percentage,
      project: {
        code,
      },
    };
  });
}
