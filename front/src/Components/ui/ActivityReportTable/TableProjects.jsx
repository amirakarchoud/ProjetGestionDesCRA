import TableBanner from './TableBanner';
import TableSelection from './TableSelection';
import {
  ActivityTypeValues,
  BannerMode,
} from '../../const/ActivityReport.constant';

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
        type={ActivityTypeValues.Project}
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
