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
        type={ActivityTypes.Project}
      />,
    );
  }

  return (
    <>
      <TableBanner
        mode={BannerMode.Week}
        text={'Project(s)'}
        week={activityReport.week()}
      />
      {projectsSelections}
    </>
  );
}

export default TableProjects;
