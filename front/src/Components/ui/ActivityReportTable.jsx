import Stack from '@mui/material/Stack';
import styles from './styles/ActivityReportTable.module.css';
import { ActivityReport } from '../models/ActivityReport';
import { LocalDate } from '@js-joda/core';
import { useEffect, useState } from 'react';
import TableActions from './ActivityReportTable/TableActions';
import TableValidation from './ActivityReportTable/TableValidation';
import TableAbsences from './ActivityReportTable/TableAbsences';
import TableProjects from './ActivityReportTable/TableProjects';
import ActivityReportApi from '../../Services/api/ActivityReport.api';
import NotificationsHandler from '../../Services/handlers/NotificationsHandler';

function ActivityReportTable() {
  const [activityReport, setActivityReport] = useState(
    new ActivityReport(
      [],
      [],
      'aleksandar.kirilov@proxym.fr',
      [],
      LocalDate.now(),
      ActivityReportApi,
      NotificationsHandler,
    ),
  );

  useEffect(() => {
    activityReport.activityReportApi
      .fetchActivities(
        activityReport.employeeEmail,
        activityReport.month,
        activityReport.year,
      )
      .then((data) => {
        const { activities, availableDates, holidays } = data;
        setActivityReport(
          Object.assign(
            new ActivityReport(
              activities,
              availableDates,
              activityReport.employeeEmail,
              holidays,
              activityReport.localDate,
              ActivityReportApi,
              NotificationsHandler,
            ),
          ),
        );
      });
  }, [
    activityReport.activityReportApi,
    activityReport.employeeEmail,
    activityReport.month,
    activityReport.year,
  ]);

  const updateView = () => {
    const { activities, availableDates, employeeEmail, holidays, localDate } =
      activityReport;
    setActivityReport(
      Object.assign(
        new ActivityReport(
          activities,
          availableDates,
          employeeEmail,
          holidays,
          localDate,
          ActivityReportApi,
          NotificationsHandler,
        ),
      ),
    );
  };

  /**
   * @callback addActivityCallback
   * @param code {string}
   * @param date {LocalDate}
   * @param name {Absences}
   * @param percentage {number}
   * @param type {('absence'|'project')}
   */

  /**
   * @param code {string}
   * @param date {LocalDate}
   * @param name {string}
   * @param percentage {number}
   * @param type {('absence'|'project')}
   */
  const addActivity = (code, date, name, percentage, type) => {
    activityReport.addActivity(code, date, name, percentage, type);
    updateView();
  };

  /**
   * @callback addWeekActivityCallback
   * @param code {string}
   * @param name {string}
   * @param percentage {number}
   * @param type {('absence'|'project')}
   */

  /**
   * @param code {string}
   * @param name {string}
   * @param percentage {number}
   * @param type {('absence'|'project')}
   */
  const addWeekActivity = (code, name, percentage, type) => {
    activityReport.week().forEach((date) => {
      activityReport.addActivity(code, date, name, percentage, type);
    });
    updateView();
  };

  /**
   * @callback updateActivityCodeCallback
   * @param previousCode {string}
   * @param newCode {string}
   * @param type {('absence'|'project')}
   */

  /**
   * @param previousCode {string}
   * @param newCode {string}
   * @param type {('absence'|'project')}
   */
  const updateActivityCode = (previousCode, newCode, type) => {
    activityReport.updateActivityCode(previousCode, newCode, type);
    updateView();
  };

  /**
   * @callback deleteWeekActivityCallback
   * @param code {string}
   */

  /**
   * @param code {string}
   */
  const deleteWeekActivity = (code) => {
    activityReport.deleteWeekActivity(code);
    updateView();
  };

  /** @callback DefaultCallback */

  const validateWeek = () => {
    activityReport.validateWeek();
    updateView();
  };

  /**
   * @typedef {Readonly<{nextWeek: (function(): void), previousWeek: (function(): void), previousWeekText: (function(): string), nextWeekText: (function(): string)}>} fnActionsType
   */

  /**
   *
   * @type {fnActionsType}
   */
  const fnActions = Object.freeze({
    nextWeek: () => {
      activityReport.nextWeek();
      updateView();
    },
    previousWeek: () => {
      activityReport.previousWeek();
      updateView();
    },
    nextWeekText: () => {
      return activityReport.yearMonthWeek().length === 2 &&
        activityReport.localDate.month().value() !==
          activityReport.yearMonthWeek()[1].month().value()
        ? 'Next Month'
        : 'Next Week';
    },
    previousWeekText: () => {
      return activityReport.yearMonthWeek().length === 2 &&
        activityReport.localDate.isEqual(
          activityReport.localDate.withDayOfMonth(1),
        )
        ? 'Previous Month'
        : 'Previous Week';
    },
  });

  return (
    <>
      <TableActions actions={fnActions} />
      <Stack direction="column" className={styles.table}>
        <TableProjects
          activityReport={activityReport}
          addActivity={addActivity}
        />
        <TableAbsences
          activityReport={activityReport}
          addActivity={addActivity}
          addWeekActivity={addWeekActivity}
          deleteWeekActivity={deleteWeekActivity}
          updateActivityCode={updateActivityCode}
        />
      </Stack>
      <TableValidation
        activityReport={activityReport}
        validateWeek={validateWeek}
      />
    </>
  );
}

export default ActivityReportTable;
