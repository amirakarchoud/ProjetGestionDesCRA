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

  useEffect(() => {
    fetch('https://run.mocky.io/v3/e5e79e53-a7aa-4981-81f0-bee7f016f829')
      .then(res => res.json())
      .then((result) => {
        console.log(result);
        let resultActivities = [];

        for (const project of result.activities) {
          for (const activity of project.activities) {
            resultActivities.push({
              project: project.projectCode,
              date: LocalDate.parse(activity.date),
              percent: activity.percentage,
              type: activity.type,
            });
          }
        }
        const filteredActivities = {
          projects: resultActivities.filter(ra => ra.type === 'Project'),
          absences: resultActivities.filter(ra => ra.type === 'Absence')
        };

        console.log(filteredActivities);

      });
  }, []);

  const addActivity = (project, date, percentage) => {
    // modify report table
    activityReport.addActivity(project, date, percentage);
  };

  const previousWeek = () => {
    activityReport.previousWeek();
    setActivityReport(
      Object.assign(new ActivityReport(activityReport.localDate), activityReport),
    );
  };
  const nextWeek = () => {
    activityReport.nextWeek();
    setActivityReport(
      Object.assign(new ActivityReport(activityReport.localDate), activityReport),
    );
  };

  return (
    <>
      <TableActions previousWeek={previousWeek} nextWeek={nextWeek} />
      <Stack direction="column" className={styles.table}>
        <TableProjects reportTable={activityReport} addActivity={addActivity}/>
        <TableAbsences reportTable={activityReport} addActivity={addActivity}/>
      </Stack>
      <TableValidation />
    </>
  );
}

export default ActivityReportTable;
