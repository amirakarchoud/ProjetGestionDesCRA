import TableBanner from './TableBanner';
import TableSelection from './TableSelection';

function TableProjects({reportTable, addActivity}) {

  return (
    <>
      <TableBanner mode={'week'} week={reportTable.week()} text={'Project(s)'} />
    </>
  );
}

export default TableProjects;

/**
 * <TableSelection
 *         isProject={true}
 *         projectName={'PROXYM 30467890'}
 *         onActivity={addActivity}
 *         week={reportTable.week()}
 *       />
 */