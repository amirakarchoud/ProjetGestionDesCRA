import styles from '../styles/ActivityReportTable.module.css';
import { MenuItem, Select } from '@mui/material';
import Stack from '@mui/material/Stack';
import { DateTimeFormatter } from '@js-joda/core';

/**
 * @callback addActivityCallback
 * @param date {LocalDate}
 * @param name {string}
 * @param percentage {number}
 * @param type {('project'|'absence')}
 */

/**
 * @callback deleteActivityCallback
 * @param name {string}
 */

/**
 * @callback updateActivityCallback
 * @param previousName {string}
 * @param newName {string}
 * @param type {('project'|'absence')}
 */

/**
 * @callback handleActivityNameSelectionCallback
 * @param text {string}
 */

/**
 *
 * @param activityName {string}
 * @param type {('project' | 'absence')}
 * @param updateActivity {updateActivityCallback}
 * @returns {JSX.Element}
 */
function ActivityName({ name = '', type, updateActivity }) {
  if (type === 'project') {
    return <div className={styles.subtitle}>{name}</div>;
  }
  if (type === 'absence') {
    const absences = [
      { value: 'congesExceptionels', text: 'Congés exceptionnels' },
      { value: 'congesPayes', text: 'Congés payés' },
      { value: 'congeSansSolde', text: 'Congé sans solde' },
      { value: 'formation', text: 'En formation' },
      { value: 'maladie', text: 'Maladie' },
      { value: 'rtt', text: 'RTT' },
    ];

    const absenceOptions = [];
    absences.forEach((absence) => {
      absenceOptions.push(
        <MenuItem key={absence.value} value={absence.value}>
          {absence.text}
        </MenuItem>,
      );
    });

    return (
      <>
        <Select
          name="select-absence"
          value={name}
          defaultValue={''}
          className={styles.absenceSelect}
          onChange={(event) => updateActivity(name, event?.target?.value, type)}
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
 * @param activities {{date: LocalDate; name: string; percentage: number; projects: {client: string; code: string; name: string; status: string;}; type: string;}[]}
 * @param activityReport {ActivityReport}
 * @param addActivity {addActivityCallback}
 * @param name {string}
 * @param type {('project' | 'absence')}
 * @returns {JSX.Element[]}
 * @constructor
 */
function Selects({ activities, activityReport, addActivity, name, type }) {
  const percentages = [0, 25, 50, 75, 100];
  const percentsSelections = [];
  for (const percentage of percentages) {
    percentsSelections.push(
      <MenuItem key={percentage} value={percentage}>
        {percentage}%
      </MenuItem>,
    );
  }

  const selects = [];
  const dataByDate = activityReport.groupByKey(activities, 'date');
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
          disabled={!name}
          onChange={(event) =>
            addActivity(date, name, event.target.value, type)
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
 * @param deleteActivity {deleteActivityCallback}
 * @param name {string}
 * @param type {('project' | 'absence')}
 * @returns {JSX.Element}
 * @constructor
 */
function ActivityAction({ deleteActivity, name, type }) {
  if (type === 'absence') {
    return (
      <>
        <p
          className={styles.activityAction}
          onClick={() => deleteActivity(name)}
        >
          Delete this absence
        </p>
      </>
    );
  }
}

/**
 * @param activities {{date: LocalDate; name: string; percentage: number; projects: {client: string; code: string; name: string; status: string;}; type: string;}[]}
 * @param activityReport {ActivityReport}
 * @param addActivity {addActivityCallback}
 * @param deleteActivity {deleteActivityCallback}
 * @param name {string}
 * @param type {('project' | 'absence')}
 * @param updateActivity {updateActivityCallback}
 * @returns {JSX.Element}
 */
function TableSelection({
  activities,
  activityReport,
  addActivity,
  deleteActivity,
  name,
  type,
  updateActivity,
}) {
  return (
    <>
      <Stack direction="row" className={styles.block}>
        <ActivityName name={name} type={type} updateActivity={updateActivity} />
        <div className={styles.list}>
          <Selects
            activities={activities}
            activityReport={activityReport}
            addActivity={addActivity}
            name={name}
            type={type}
          />
        </div>
      </Stack>
      <ActivityAction deleteActivity={deleteActivity} name={name} type={type} />
    </>
  );
}
export default TableSelection;
