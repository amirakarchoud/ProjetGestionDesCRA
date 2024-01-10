import styles from '../styles/ActivityReportTable.module.css';
import Stack from '@mui/material/Stack';
import { DateTimeFormatter } from '@js-joda/core';
import { Button } from '@mui/material';
import {
  ActivityTypeValues,
  BannerMode,
} from '../../const/ActivityReport.constant';

/**
 * @param addWeekActivity {addWeekActivityCallback}
 * @param mode {('week' | 'text' | 'button')}
 * @param text {string}
 * @param week {LocalDate[]}
 * @returns {JSX.Element}
 * @constructor
 */
function Banner({ addWeekActivity, mode, text = '', week = [] }) {
  if (mode === BannerMode.Week) {
    return (
      <>
        <div className={styles.title}>{text}</div>
        <div className={styles.list}>
          {week.map((day, i) => (
            <div key={i} className={styles.element}>
              <div className={styles.weekDay}>{day.dayOfWeek().toString()}</div>
              <div className={styles.date}>
                {day.format(DateTimeFormatter.ISO_LOCAL_DATE)}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }
  if (mode === BannerMode.Text) {
    return <div className={styles.title}>{text}</div>;
  }
  if (mode === BannerMode.Button) {
    return (
      <div>
        <Button
          color="primary"
          variant="contained"
          onClick={() => addWeekActivity('', '', 0, ActivityTypeValues.Absence)}
        >
          {text}
        </Button>
      </div>
    );
  }
  return <div>Warning: No mode provided</div>;
}

/**
 * @param addWeekActivity {addWeekActivityCallback}
 * @param mode {('week' | 'text' | 'button')}
 * @param text {string}
 * @param week {LocalDate[]}
 * @returns {JSX.Element}
 * @constructor
 */
function TableBanner({ addWeekActivity, mode, text, week }) {
  return (
    <Stack
      direction="row"
      className={`${styles.block} ${
        mode === BannerMode.Button ? '' : styles.grey
      }`}
    >
      <Banner
        mode={mode}
        text={text}
        week={week}
        addWeekActivity={addWeekActivity}
      />
    </Stack>
  );
}

export default TableBanner;
