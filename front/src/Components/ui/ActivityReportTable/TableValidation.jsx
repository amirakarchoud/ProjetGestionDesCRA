import { Button } from '@mui/material';
import styles from '../styles/ActivityReportTable.module.css';
import { DateTimeFormatter } from '@js-joda/core';

/**
 * @callback validateWeekCallback
 */

/**
 * @param activityReport {ActivityReport}
 * @param validateWeek {validateWeekCallback}
 * @returns {JSX.Element}
 * @constructor
 */
function TableValidation({ activityReport, validateWeek }) {
  const holidaysDisplay = [];
  const offDatesWeek = [...activityReport.week()].filter((date) =>
    activityReport
      .isoHolidaysDates()
      .includes(date.format(DateTimeFormatter.ISO_LOCAL_DATE)),
  );
  if (offDatesWeek?.length) {
    activityReport.holidays.forEach((holiday) => {
      holidaysDisplay.push(
        <p
          key={holiday.date.format(DateTimeFormatter.ISO_LOCAL_DATE)}
          className={styles.holidaysDisplay}
        >
          {holiday.date.format(DateTimeFormatter.ISO_LOCAL_DATE)} is off due to{' '}
          {holiday.name}.
        </p>,
      );
    });
  }

  return (
    <>
      <div className={styles.validationContainer}>
        <div>{holidaysDisplay}</div>
        <Button color="primary" variant="outlined" onClick={validateWeek}>
          Validate week
        </Button>
      </div>
    </>
  );
}

export default TableValidation;
