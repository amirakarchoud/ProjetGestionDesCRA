import Stack from '@mui/material/Stack';
import styles from './styles/ActivityReportTable.module.css';
import { ActivityReport } from '../models/ActivityReport';
import { LocalDate } from '@js-joda/core';
import { useEffect, useState } from 'react';
import TableActions from './ActivityReportTable/TableActions';
import TableValidation from './ActivityReportTable/TableValidation';
import TableAbsences from './ActivityReportTable/TableAbsences';
import TableProjects from './ActivityReportTable/TableProjects';

function ActivityReportTable() {
  const [activityReport, setActivityReport] = useState(
    new ActivityReport(LocalDate.now()),
  );

  const updateView = () => {
    setActivityReport(
      Object.assign(
        new ActivityReport(activityReport.localDate, activityReport.activities),
        activityReport,
      ),
    );
  };

  const apiUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    fetch(
      `${apiUrl}/v2/private/activity-report/aleksandar.kirilov@proxym.fr/2023/12`,
    )
      .then((res) => res.json())
      .then((res) => {
        const { absences, projects } = res;
        const activities = [...absences, ...projects];
        activities.map((activity) => {
          activity.date = LocalDate.parse(activity.date);
          return activity;
        });
        setActivityReport(
          Object.assign(new ActivityReport(LocalDate.now(), activities)),
        );
      });
  }, [apiUrl]);

  /**
   *
   * @param date {LocalDate}
   * @param name {string}
   * @param percentage {number}
   * @param type {('project'|'absence')}
   */
  const addActivity = (date, name, percentage, type) => {
    activityReport.addActivity(date, name, percentage, type);
    updateView();
  };

  const addWeekActivity = (name, percentage, type) => {
    activityReport.week().forEach((date) => {
      activityReport.addActivity(date, name, percentage, type);
    });
    updateView();
  };

  /**
   *
   * @param previousName {string}
   * @param newName {string}
   * @param type {('project'|'absence')}
   */
  const updateActivity = (previousName, newName, type) => {
    activityReport.updateActivity(previousName, newName, type);
    updateView();
  };

  /**
   *
   * @param name {string}
   */
  const deleteActivity = (name) => {
    activityReport.deleteActivity(name);
    updateView();
  };

  const previousWeek = () => {
    activityReport.previousWeek();
    setActivityReport(
      Object.assign(
        new ActivityReport(activityReport.localDate),
        activityReport,
      ),
    );
  };

  const nextWeek = () => {
    activityReport.nextWeek();
    setActivityReport(
      Object.assign(
        new ActivityReport(activityReport.localDate),
        activityReport,
      ),
    );
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
          deleteActivity={deleteActivity}
          updateActivity={updateActivity}
        />
      </Stack>
      <TableValidation />
    </>
  );
}

export default ActivityReportTable;
