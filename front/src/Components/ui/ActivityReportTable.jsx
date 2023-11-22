import TableBanner from './TableBanner';
import Stack from '@mui/material/Stack';
import styles from './styles/ActivityReportTable.module.css';
import TableSelection from './TableSelection';
import { ActivityReport } from '../models/ActivityReport';
import { LocalDate } from '@js-joda/core';
import { useState } from 'react';
import { Button } from '@mui/material';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
function ActivityReportTable() {
  const [reportTable, setReportTable] = useState(
    new ActivityReport(LocalDate.now()),
  );

  const onActivity = (project, date, percentage) => {
    // modify report table
    reportTable.addActivity(project, date, percentage);
  };

  const previousWeek = () => {
    reportTable.previousWeek();
    setReportTable(
      Object.assign(new ActivityReport(reportTable.localDate), reportTable),
    );
  };
  const nextWeek = () => {
    reportTable.nextWeek();
    setReportTable(
      Object.assign(new ActivityReport(reportTable.localDate), reportTable),
    );
  };

  return (
    <>
      <Stack direction="row">
        <Button
          color="primary"
          variant="outlined"
          startIcon={<ArrowCircleLeftIcon />}
          onClick={previousWeek}
        ></Button>
        <Button
          color="primary"
          variant="outlined"
          endIcon={<ArrowCircleRightIcon />}
          onClick={nextWeek}
        ></Button>
        <Button color="primary" variant="outlined">
          Submit
        </Button>
      </Stack>
      <Stack direction="column" className={styles.table}>
        <TableBanner list={reportTable.week()} title={'Project'} />
        <TableSelection
          isProject={true}
          projectName={'PROXYM 30467890'}
          onActivity={onActivity}
          week={reportTable.week()}
        ></TableSelection>
        <TableBanner title={'Absence'} />
        <TableSelection
          isAbsence={true}
          week={reportTable.week()}
          onActivity={onActivity}
        ></TableSelection>
        <TableSelection
          isAbsence={true}
          week={reportTable.week()}
          onActivity={onActivity}
        ></TableSelection>
      </Stack>
      <Button color="primary" variant="contained">
        Validate week
      </Button>
    </>
  );
}

export default ActivityReportTable;
