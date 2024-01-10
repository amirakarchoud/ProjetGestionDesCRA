import axios from 'axios';
import { fetchActivitiesMapper } from '../mappers/fetchActivities.mapper';
import { postActivitiesMapper } from '../mappers/postActivities.mapper';
import { DateTimeFormatter, YearMonth } from '@js-joda/core';

const apiBaseUrl = process.env.REACT_APP_API_URL;

/**
 * @typedef {Readonly<Object>} ActivityReportApiType
 * @property {function(string, number, number): Promise<{activities: ActivitiesType, availableDates: AvailableDatesType, holidays: HolidaysType}>} fetchActivities
 * @property {function(ActivitiesType, string, number, number): Promise<axios.AxiosResponse<any>|T>} postActivities
 */

/**
 * @type {ActivityReportApiType}
 */
const ActivityReportApi = Object.freeze({
  /**
   *
   * @param employeeEmail {string}
   * @param month {number}
   * @param year {number}
   * @return {Promise<{activities: ActivitiesType, availableDates: AvailableDatesType, holidays: HolidaysType}>}
   */
  fetchActivities: async (employeeEmail, month, year) => {
    const currentYearMonth = YearMonth.parse(
      `${year}-${month}`,
      DateTimeFormatter.ofPattern('yyyy-M'),
    );
    const previousYearMonth = currentYearMonth.minusMonths(1);
    const nextYearMonth = currentYearMonth.plusMonths(1);

    const getPreviousYearMonth = axios.get(
      `${apiBaseUrl}/v2/private/activity-report/${employeeEmail}/${previousYearMonth.year()}/${previousYearMonth
        .month()
        .value()}`,
    );
    const getCurrentYearMonth = axios.get(
      `${apiBaseUrl}/v2/private/activity-report/${employeeEmail}/${currentYearMonth.year()}/${currentYearMonth
        .month()
        .value()}`,
    );
    const getNextYearMonth = axios.get(
      `${apiBaseUrl}/v2/private/activity-report/${employeeEmail}/${nextYearMonth.year()}/${nextYearMonth
        .month()
        .value()}`,
    );

    return await axios
      .all([getPreviousYearMonth, getCurrentYearMonth, getNextYearMonth])
      .then(([previousYearMonth, currentYearMonth, nextYearMonth]) => {
        const absences = [
          ...previousYearMonth.data.absences,
          ...currentYearMonth.data.absences,
          ...nextYearMonth.data.absences,
        ];
        const availableDates = [
          ...previousYearMonth.data.availableDates,
          ...currentYearMonth.data.availableDates,
          ...nextYearMonth.data.availableDates,
        ];
        const holidays = [
          ...previousYearMonth.data.holidays,
          ...currentYearMonth.data.holidays,
          ...nextYearMonth.data.holidays,
        ];
        const projects = [
          ...previousYearMonth.data.projects,
          ...currentYearMonth.data.projects,
          ...nextYearMonth.data.projects,
        ];

        return fetchActivitiesMapper(
          absences,
          availableDates,
          holidays,
          projects,
        );
      });
  },

  /**
   *
   * @param activities {ActivitiesType}
   * @param employeeEmail {string}
   * @param month {number}
   * @param year {number}
   * @return {Promise<T>}
   */
  postActivities: async (activities, employeeEmail, month, year) => {
    const url = `${apiBaseUrl}/v2/private/activity-report`;
    return await axios
      .post(url, postActivitiesMapper(activities, employeeEmail, month, year))
      .then((res) => res);
  },
});

export default ActivityReportApi;
