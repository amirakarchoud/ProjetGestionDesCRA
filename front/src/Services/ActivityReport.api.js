import axios from 'axios';
import { fetchActivitiesMapper } from './Mappers/fetchActivities.mapper';

const apiBaseUrl = process.env.REACT_APP_API_URL;

const ActivityReportApi = {
  /**
   *
   * @param employeeEmail {string}
   * @param month {number}
   * @param year {number}
   * @return {Promise<{activities: {code: (Absences|string), date: LocalDate, name: (Absences|string), percentage: number, type: ('absence'|'project')}[], availableDates: {availableTime: number, date: LocalDate}[], holidays: {date: LocalDate, name: string, percentage: number, type: ActivityTypes.Holiday}[]}>}
   */
  fetchActivities: async (employeeEmail, month, year) => {
    const url = `${apiBaseUrl}/v2/private/activity-report/${employeeEmail}/${year}/${month}`;
    return await axios
      .get(url)
      .then((res) => {
        const { absences, availableDates, holidays, projects } = res.data;
        return fetchActivitiesMapper(
          absences,
          availableDates,
          holidays,
          projects,
        );
      })
      .catch((err) => err);
  },

  /**
   *
   * @param payload {{activities: {absences: {date: string, percentage: number, reason: Absences}[], projects: {date: string; percentage: number; project: {code: string; name: string;}}[]}[]; employeeEmail: string; month: number; year: number; replace: boolean;}}
   * @return {Promise<T>}
   */
  postActivities: async (payload) => {
    const url = `${apiBaseUrl}/v2/private/activity-report`;
    return await axios
      .post(url, payload)
      .then((res) => res)
      .catch((err) => err);
  },
};

export default ActivityReportApi;
