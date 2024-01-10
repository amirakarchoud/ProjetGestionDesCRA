import styles from '../styles/ActivityReportTable.module.css';
import { MenuItem, Select } from '@mui/material';
import Stack from '@mui/material/Stack';
import { DateTimeFormatter } from '@js-joda/core';
import {
  Absences,
  ActivityTypes,
  Percentages,
} from '../../const/ActivityReport.constant';

/**
 * @callback addActivityCallback
 * @param code {string}
 * @param date {LocalDate}
 * @param name {string}
 * @param percentage {number}
 * @param type {('absence'|'project')}
 */

/**
 * @callback deleteWeekActivityCallback
 * @param code {string}
 */

/**
 * @callback updateActivityCodeCallback
 * @param previousCode {string}
 * @param newCode {string}
 * @param type {('absence'|'project')}
 */

/**
 * @callback handleActivityNameSelectionCallback
 * @param text {string}
 */

/**
 * @param code {string}
 * @param name {string}
 * @param type {('absence'|'project')}
 * @param updateActivityCode {updateActivityCodeCallback}
 * @returns {JSX.Element}
 */
function ActivityName({ code, name = '', type, updateActivityCode }) {
  if (type === ActivityTypes.Project) {
    return <div className={styles.subtitle}>{name}</div>;
  }
  if (type === ActivityTypes.Absence) {
    const absenceOptions = [];
    Object.keys(Absences).forEach((absence) => {
      absenceOptions.push(
        <MenuItem key={absence} value={absence}>
          {Absences[absence]}
        </MenuItem>,
      );
    });

    return (
      <>
        <Select
          name="select-absence"
          value={code}
          defaultValue={''}
          className={styles.absenceSelect}
          onChange={(event) =>
            updateActivityCode(code, event?.target?.value, type)
          }
        >
          {absenceOptions}
        </Select>
      </>
    );
  }
  return <div>Warning: No mode provided</div>;
}

/**
 *
 * @param activities {{code: string; date: LocalDate; name: string; percentage: number; type: 'absence'|'project'}[]}
 * @param activityReport {ActivityReport}
 * @param addActivity {addActivityCallback}
 * @param code {string}
 * @param name {string}
 * @param type {('absence'|'project')}
 * @returns {JSX.Element[]}
 * @constructor
 */
function Selects({
  activities,
  activityReport,
  addActivity,
  code,
  name,
  type,
}) {
  const percentsSelections = [];
  for (const percentage of Object.keys(Percentages)) {
    percentsSelections.push(
      <MenuItem key={percentage} value={percentage}>
        {Percentages[percentage]}%
      </MenuItem>,
    );
  }

  const selects = [];
  const dataByDate = activityReport.groupByKey(activities, 'date');
  const isoHolidayDates = [...activityReport.holidays].map((holiday) => {
    return holiday.date.format(DateTimeFormatter.ISO_LOCAL_DATE);
  });
  for (const date of activityReport.week()) {
    const value = dataByDate[date.format(DateTimeFormatter.ISO_LOCAL_DATE)];
    selects.push(
      <div
        key={date.format(DateTimeFormatter.ISO_LOCAL_DATE)}
        className={styles.select}
      >
        <Select
          name="select-percent"
          value={value ? value[0].percentage : 0}
          defaultValue={0}
          className={styles.select}
          disabled={
            !code ||
            isoHolidayDates.includes(
              date.format(DateTimeFormatter.ISO_LOCAL_DATE),
            )
          }
          onChange={(event) =>
            addActivity(code, date, name, +event.target.value, type)
          }
        >
          {percentsSelections}
        </Select>
      </div>,
    );
  }
  return selects;
}

/**
 * @param code {string}
 * @param deleteWeekActivity {deleteWeekActivityCallback}
 * @param type {('absence'|'project')}
 * @returns {JSX.Element}
 * @constructor
 */
function ActivityAction({ code, deleteWeekActivity, type }) {
  if (type === ActivityTypes.Absence) {
    return (
      <>
        <p
          className={styles.activityAction}
          onClick={() => deleteWeekActivity(code)}
        >
          Delete this absence
        </p>
      </>
    );
  }
}

/**
 * @param activities {{code: string; date: LocalDate; name: string; percentage: number; type: 'absence'|'project'}[]}
 * @param activityReport {ActivityReport}
 * @param addActivity {addActivityCallback}
 * @param deleteWeekActivity {deleteWeekActivityCallback}
 * @param type {('absence' | 'project')}
 * @param updateActivityCode {updateActivityCodeCallback}
 * @returns {JSX.Element}
 */
function TableSelection({
  activities,
  activityReport,
  addActivity,
  deleteWeekActivity,
  type,
  updateActivityCode,
}) {
  const code = [...new Set(activities.map((activity) => activity.code))][0];
  const name = [...new Set(activities.map((activity) => activity.name))][0];
  return (
    <>
      <Stack direction="row" className={styles.block}>
        <ActivityName
          code={code}
          name={name}
          type={type}
          updateActivityCode={updateActivityCode}
        />
        <div className={styles.list}>
          <Selects
            activities={activities}
            activityReport={activityReport}
            addActivity={addActivity}
            code={code}
            name={name}
            type={type}
          />
        </div>
      </Stack>
      <ActivityAction
        code={code}
        deleteWeekActivity={deleteWeekActivity}
        type={type}
      />
    </>
  );
}
export default TableSelection;
