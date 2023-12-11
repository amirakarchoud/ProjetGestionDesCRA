import { Button } from '@mui/material';
import styles from '../styles/ActivityReportTable.module.css';

function TableValidation() {

  return (
    <>
      <div className={styles.validationContainer}>
        <Button color="primary" variant="outlined">
          Validate week
        </Button>
      </div>
    </>
  );
}

export default TableValidation;
