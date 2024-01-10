import { Button } from '@mui/material';
import styles from '../styles/ActivityReportTable.module.css';
import { DateTimeFormatter } from '@js-joda/core';

/**
 * @param activityReport {ActivityReport}
 * @param validateWeek {DefaultCallback}
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
    offDatesWeek.forEach((d) => {
      const offDate = activityReport.holidays
        .filter(
          (h) =>
            h.date.format(DateTimeFormatter.ISO_LOCAL_DATE) ===
            d.format(DateTimeFormatter.ISO_LOCAL_DATE),
        )
        .shift();
      holidaysDisplay.push(
        <p
          key={offDate.date.format(DateTimeFormatter.ISO_LOCAL_DATE)}
          className={styles.holidaysDisplay}
        >
          {offDate.date.format(DateTimeFormatter.ISO_LOCAL_DATE)} is off due to{' '}
          {offDate.name}.
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
