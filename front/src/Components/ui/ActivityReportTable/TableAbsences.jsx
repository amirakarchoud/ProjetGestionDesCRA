import TableBanner from './TableBanner';
import TableSelection from './TableSelection';

/**
 * @callback addActivityCallback
 * @param date {LocalDate}
 * @param name {string}
 * @param percentage {number}
 * @param type {('project'|'absence')}
 */

/**
 * @callback addWeekActivityCallback
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
 *
 * @param activityReport {ActivityReport}
 * @param addActivity {addActivityCallback}
 * @param addWeekActivity {addWeekActivityCallback}
 * @param deleteActivity {deleteActivityCallback}
 * @param updateActivity {updateActivityCallback}
 * @returns {JSX.Element}
 * @constructor
 */
function TableAbsences({
  activityReport,
  addActivity,
  addWeekActivity,
  deleteActivity,
  updateActivity,
}) {
  const absences = activityReport.weekAbsences();
  const absencesSelections = [];
  for (const absence in absences) {
    absencesSelections.push(
      <TableSelection
        key={absence}
        activities={absences[absence]}
        activityReport={activityReport}
        addActivity={addActivity}
        deleteActivity={deleteActivity}
        name={absence}
        type={'absence'}
        updateActivity={updateActivity}
      />,
    );
  }

  return (
    <>
      <TableBanner mode={'text'} text={'Absence(s)'} />
      {absencesSelections}
      <TableBanner
        mode={'button'}
        text={'Add an absence'}
        addWeekActivity={addWeekActivity}
      />
    </>
  );
}

export default TableAbsences;
