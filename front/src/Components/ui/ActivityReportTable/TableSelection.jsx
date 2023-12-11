import styles from '../styles/ActivityReportTable.module.css';
import Stack from '@mui/material/Stack';
import TableSelect from './TableSelect';
import TableItem from './TableItem';
import { useState } from 'react';

function TableSelection({
  isProject,
  isAbsence,
  projectName,
  onActivity,
  week,
}) {
  const [absence, setAbsence] = useState('');

  const handleItemClick = (value) => {
    setAbsence(value);
  };

  return (
    <Stack direction="row" className={styles.block}>
      <TableItem
        absence={isAbsence}
        project={isProject}
        text={projectName}
        handleItemClick={handleItemClick}
      />
      <div className={styles.list}>
        <TableSelect
          week={week}
          projectName={projectName ?? absence}
          onActivity={onActivity}
        />
      </div>
    </Stack>
  );
}

export default TableSelection;
