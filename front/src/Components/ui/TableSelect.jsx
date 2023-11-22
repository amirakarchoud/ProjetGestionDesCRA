import styles from './styles/ActivityReportTable.module.css';
import { MenuItem, Select } from '@mui/material';

export default function TableSelect({ projectName, week, onActivity }) {
  const content = [];
  const percentages = [0, 25, 50, 75, 100];

  for (let a = 0; a < week.length; a++) {
    content.push(
      <div key={a} className={styles.select}>
        <Select
          defaultValue={0}
          className={styles.select}
          disabled={!projectName}
          onChange={(event) =>
            onActivity(projectName, week[a], event.target.value)
          }
        >
          {percentages.map((percentage, i) => (
            <MenuItem key={i} value={percentage}>
              {percentage}%
            </MenuItem>
          ))}
        </Select>
      </div>,
    );
  }
  return content;
}
