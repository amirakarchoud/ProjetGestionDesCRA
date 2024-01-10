import Stack from '@mui/material/Stack';
import styles from './styles/ActivityReportTable.module.css';
import { ActivityReport } from '../models/ActivityReport';
import { LocalDate } from '@js-joda/core';
import { useEffect, useState } from 'react';
import TableActions from './ActivityReportTable/TableActions';
import TableValidation from './ActivityReportTable/TableValidation';
import TableAbsences from './ActivityReportTable/TableAbsences';
import TableProjects from './ActivityReportTable/TableProjects';
import ActivityReportApi from '../../Services/ActivityReport.api';

function ActivityReportTable() {
  const [activityReport, setActivityReport] = useState(
    new ActivityReport(LocalDate.now(), [], [], [], ActivityReportApi),
  );

  useEffect(() => {
    activityReport.activityReportApi
      .fetchActivities(
        'aleksandar.kirilov@proxym.fr',
        activityReport.month.value(),
        activityReport.year,
      )
      .then((data) => {
        setActivityReport(
          Object.assign(
            new ActivityReport(
              LocalDate.now(),
              data.activities,
              data.availableDates,
              data.holidays,
              ActivityReportApi,
            ),
          ),
        );
      });
  }, [ActivityReportApi]);

  const updateView = () => {
    setActivityReport(
      Object.assign(
        new ActivityReport(
          activityReport.localDate,
          activityReport.activities,
          activityReport.availableDates,
          activityReport.holidays,
          ActivityReportApi,
        ),
      ),
    );
  };

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
   * @param previousCode {string}
   * @param newCode {string}
   * @param type {('absence'|'project')}
   */
  const updateActivityCode = (previousCode, newCode, type) => {
    activityReport.updateActivityCode(previousCode, newCode, type);
    updateView();
  };

  /**
   * @param code {string}
   */
  const deleteWeekActivity = (code) => {
    activityReport.deleteWeekActivity(code);
    updateView();
  };

  const previousWeek = () => {
    activityReport.previousWeek();
    updateView();
  };

  const nextWeek = () => {
    activityReport.nextWeek();
    updateView();
  };

  const validateWeek = () => {
    activityReport.validateWeek();
    updateView();
  };

  return (
    <>
      <TableActions previousWeek={previousWeek} nextWeek={nextWeek} />
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
