import TableBanner from './TableBanner';
import TableSelection from './TableSelection';
import { ActivityTypes, BannerMode } from '../../const/ActivityReport.constant';

/**
 * @callback addActivityCallback
 * @param code {string}
 * @param date {LocalDate}
 * @param name {string}
 * @param percentage {number}
 * @param type {('absence'|'project')}
 */

/**
 * @callback addWeekActivityCallback
 * @param code {string}
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
 *
 * @param activityReport {ActivityReport}
 * @param addActivity {addActivityCallback}
 * @param addWeekActivity {addWeekActivityCallback}
 * @param deleteWeekActivity {deleteWeekActivityCallback}
 * @param updateActivityCode {updateActivityCodeCallback}
 * @returns {JSX.Element}
 * @constructor
 */
function TableAbsences({
  activityReport,
  addActivity,
  addWeekActivity,
  deleteWeekActivity,
  updateActivityCode,
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
        deleteWeekActivity={deleteWeekActivity}
        type={ActivityTypes.Absence}
        updateActivityCode={updateActivityCode}
      />,
    );
  }

  return (
    <>
      <TableBanner mode={BannerMode.Text} text={'Absence(s)'} />
      {absencesSelections}
      <TableBanner
        mode={BannerMode.Button}
        text={'Add an absence'}
        addWeekActivity={addWeekActivity}
      />
    </>
  );
}

export default TableAbsences;
