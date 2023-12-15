import styles from '../styles/ActivityReportTable.module.css';
import Stack from '@mui/material/Stack';
import { DateTimeFormatter } from '@js-joda/core';
import { Button } from '@mui/material';

/**
 *
 * @param mode {('week' | 'text' | 'button')}
 * @param text {string}
 * @param week {LocalDate[]}
 * @returns {JSX.Element}
 * @constructor
 */
function Banner({ mode, text = '', week = [] }) {
  if (mode === 'week') {
    return (
      <>
        <div className={styles.title}>{text}</div>
        <div className={styles.list}>
          {week.map((day, i) => (
            <div key={i} className={styles.element}>
              <div className={styles.weekDay}>{day.dayOfWeek().toString()}</div>
              <div className={styles.date}>
                {day.format(DateTimeFormatter.ofPattern('(dd/MM/yyyy)'))}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }
  if (mode === 'text') {
    return <div className={styles.title}>{text}</div>;
  }
  if (mode === 'button') {
    return (
      <div>
        <Button color="primary" variant="contained">
          {text}
        </Button>
      </div>
    );
  }
  return <div>Warning: No mode provided</div>;
}

/**
 *
 * @param mode {('week' | 'text' | 'button')}
 * @param text {string}
 * @param week {LocalDate[]}
 * @returns {JSX.Element}
 * @constructor
 */
function TableBanner({ mode, text, week }) {
  return (
    <Stack
      direction="row"
      className={`${styles.block} ${mode === 'button' ? '' : styles.grey}`}
    >
      <Banner mode={mode} text={text} week={week} />
    </Stack>
  );
}

export default TableBanner;
