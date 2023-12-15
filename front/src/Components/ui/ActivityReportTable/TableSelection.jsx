import styles from '../styles/ActivityReportTable.module.css';
import { MenuItem, Select } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
import { DateTimeFormatter } from '@js-joda/core';

/**
 * @callback addActivityCallback
 * @param date {LocalDate}
 * @param name {string}
 * @param percentage {number}
 * @param type {('project'|'absence')}
 */

/**
 * @callback handleActivityNameSelectionCallback
 * @param text {string}
 */

/**
 *
 * @param activityName {string}
 * @param handleActivityNameSelection {handleActivityNameSelectionCallback}
 * @param type {('project' | 'absence')}
 * @returns {JSX.Element}
 */
function ActivityName({ name = '', handleActivityNameSelection, type }) {
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
          onChange={(event) => handleActivityNameSelection(event.target.value)}
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
 * @param week {LocalDate[]}
 * @returns {JSX.Element[]}
 * @constructor
 */
function Selects({
  activities,
  activityReport,
  addActivity,
  name,
  type,
  week,
}) {
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
  for (const date of week) {
    const value =
      dataByDate[date.format(DateTimeFormatter.ofPattern('yyyy-MM-dd'))];
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
 * @param activities {{date: LocalDate; name: string; percentage: number; projects: {client: string; code: string; name: string; status: string;}; type: string;}[]}
 * @param activityReport {ActivityReport}
 * @param addActivity {addActivityCallback}
 * @param name {string}
 * @param type {('project' | 'absence')}
 * @param week {LocalDate[]}
 * @returns {JSX.Element}
 */
function TableSelection({
  activities,
  activityReport,
  addActivity,
  name,
  type,
  week,
}) {
  const [activityNameSelection, setActivityNameSelection] = useState(name);

  const handleActivityNameSelection = (value) => {
    setActivityNameSelection(value);
  };

  return (
    <>
      <Stack direction="row" className={styles.block}>
        <ActivityName
          name={activityNameSelection}
          handleActivityNameSelection={handleActivityNameSelection}
          type={type}
        />
        <div className={styles.list}>
          <Selects
            activities={activities}
            activityReport={activityReport}
            addActivity={addActivity}
            name={activityNameSelection}
            type={type}
            week={week}
          />
        </div>
      </Stack>
    </>
  );
}
export default TableSelection;
