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
 *
 * @param activityReport {ActivityReport}
 * @param addActivity {addActivityCallback}
 * @returns {JSX.Element}
 * @constructor
 */
function TableAbsences({ activityReport, addActivity }) {
  const absences = activityReport.weekAbsences();
  const absencesSelections = [];
  for (const absence in absences) {
    absencesSelections.push(
      <TableSelection
        key={absence}
        activities={absences[absence]}
        activityReport={activityReport}
        addActivity={addActivity}
        name={absence}
        type={'absence'}
        week={activityReport.week()}
      />,
    );
  }

  return (
    <>
      <TableBanner mode={'text'} text={'Absence(s)'} />
      {absencesSelections}
      <TableBanner mode={'button'} text={'Add an absence'} />
    </>
  );
}

export default TableAbsences;
