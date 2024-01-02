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
function TableProjects({ activityReport, addActivity }) {
  const projects = activityReport.weekProjects();
  const projectsSelections = [];
  for (const project in projects) {
    projectsSelections.push(
      <TableSelection
        key={project}
        activities={projects[project]}
        activityReport={activityReport}
        addActivity={addActivity}
        name={project}
        type={'project'}
      />,
    );
  }

  return (
    <>
      <TableBanner
        mode={'week'}
        text={'Project(s)'}
        week={activityReport.week()}
      />
      {projectsSelections}
    </>
  );
}

export default TableProjects;
