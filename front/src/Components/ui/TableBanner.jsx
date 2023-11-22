import styles from './styles/ActivityReportTable.module.css';
import Stack from '@mui/material/Stack';

function TableBanner({ list, title }) {
  return (
    <Stack direction="row" className={styles.block}>
      <div className={styles.title}>{title}</div>
      <div className={styles.list}>
        {(list ?? []).map((text, i) => (
          <div key={i} className={styles.element}>
            {text.dayOfWeek().toString()} || {text.toString()}
          </div>
        ))}
      </div>
    </Stack>
  );
}

export default TableBanner;
