import TableBanner from './TableBanner';
import TableSelection from './TableSelection';

function TableAbsences({reportTable, addActivity}) {

  return (
    <>
      <TableBanner mode={'text'} text={'Absence(s)'}></TableBanner>
      <TableBanner mode={'button'} text={'Add an absence'}/>
    </>
  );
}

export default TableAbsences;

/**
 * <TableSelection
 *         isAbsence={true}
 *         week={reportTable.week()}
 *         onActivity={addActivity}
 *       />
 */