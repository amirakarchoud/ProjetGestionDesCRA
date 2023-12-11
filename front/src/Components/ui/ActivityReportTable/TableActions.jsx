import { Button } from '@mui/material';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import Stack from '@mui/material/Stack';
import styles from '../styles/ActivityReportTable.module.css';

function TableActions({previousWeek, nextWeek}) {

  return (
    <>
      <div className={styles.actionsContainer}>
        <Stack direction="row" spacing={2}>
          <Button
            color="primary"
            variant="outlined"
            startIcon={<ArrowCircleLeftIcon />}
            onClick={previousWeek}
          >Previous Week</Button>
          <Button
            color="primary"
            variant="outlined"
            endIcon={<ArrowCircleRightIcon />}
            onClick={nextWeek}
          >Next Week</Button>
        </Stack>
        <Button color="primary" variant="contained">
          Submit my Activity Report
        </Button>
      </div>

    </>
  );
}

export default TableActions;
