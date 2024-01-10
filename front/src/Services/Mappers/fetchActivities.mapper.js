import { LocalDate } from '@js-joda/core';

/**
 *
 * @param absences {{date: string; name: Absences; percentage: number; reason: Absences; type: 'absence';}[]}
 * @param availableDates {{availableTime: number; date: string;}[]}
 * @param holidays {{date: string; name: string; percentage: number; type: ActivityTypes.Holiday;}[]}
 * @param projects {{date: string; name: string; percentage: number; project: {client: string; code: string; name: string; status: string;}; type: 'project';}[]}
 * @return {{activities: {code: Absences|string; date: LocalDate; name: Absences|string; percentage: number; type: 'absence'|'project';}[]; availableDates: {availableTime: number; date: LocalDate;}[]; holidays: {date: LocalDate; name: string; percentage: number; type: ActivityTypes.Holiday;}[];}}
 */
export const fetchActivitiesMapper = (
  absences,
  availableDates,
  holidays,
  projects,
) => {
  return {
    activities: [...mapAbsences(absences), ...mapProjects(projects)],
    availableDates: mapAvailableDates(availableDates),
    holidays: mapHolidays(holidays),
  };
};

/**
 *
 * @param absences {{date: string; name: Absences; percentage: number; reason: Absences; type: 'absence';}[]}
 * @returns {{code: Absences; date: LocalDate; name: Absences; percentage: number; type: 'absence';}[]}
 */
function mapAbsences(absences) {
  return absences.map((a) => {
    const { date, name, percentage, reason, type } = a;
    return {
      code: reason,
      date: LocalDate.parse(date),
      name,
      percentage,
      type,
    };
  });
}

/**
 *
 * @param availableDates {{availableTime: number; date: string;}[]}
 * @returns {{availableTime: number; date: LocalDate;}[]}
 */
function mapAvailableDates(availableDates) {
  /**
   * Temp: missing dates from back
   */
  availableDates.push({ date: '2024-01-02', availableTime: 100 });
  availableDates.push({ date: '2024-01-03', availableTime: 100 });
  availableDates.push({ date: '2024-01-04', availableTime: 100 });
  availableDates.push({ date: '2024-01-05', availableTime: 100 });
  return availableDates.map((aD) => {
    const { availableTime, date } = aD;
    return {
      availableTime,
      date: LocalDate.parse(date),
    };
  });
}

/**
 *
 * @param holidays {{date: string; name: string; percentage: number; type: ActivityTypes.Holiday;}[]}
 * @returns {{date: LocalDate; name: string; percentage: number; type: ActivityTypes.Holiday;}[]}
 */
function mapHolidays(holidays) {
  return holidays.map((h) => {
    const { date, name, percentage, type } = h;
    return {
      date: LocalDate.parse(date),
      name,
      percentage,
      type,
    };
  });
}

/**
 *
 * @param projects {{date: string; name: string; percentage: number; project: {client: string; code: string; name: string; status: string;}; type: 'project';}[]}
 * @returns {{code: string; date: LocalDate; name: string; percentage: number; type: 'project';}[]}
 */
function mapProjects(projects) {
  return projects.map((p) => {
    const { date, name, percentage, project, type } = p;
    return {
      code: project.code,
      date: LocalDate.parse(date),
      name,
      percentage,
      type,
    };
  });
}
