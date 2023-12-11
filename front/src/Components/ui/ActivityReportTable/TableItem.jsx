import styles from '../styles/ActivityReportTable.module.css';
import { MenuItem, Select } from '@mui/material';

export default function TableItem({ project, absence, text, handleItemClick }) {
  if (project) {
    return <div className={styles.title}>{text}</div>;
  }
  if (absence) {
    const absences = [
      { value: 'cp', text: 'Congés payés' },
      { value: 'ce', text: 'Congés exceptionnels' },
      { value: 'am', text: 'Arrêt maladie' },
      { value: 'rtt', text: 'RTT' },
      { value: 'css', text: 'Congés sans soldes' },
      { value: 'ef', text: 'En formation' },
    ];
    return (
      <div className={styles.title}>
        <Select
          defaultValue={''}
          className={styles.absenceSelect}
          onChange={(event) => handleItemClick(event.target.value)}
        >
          {absences.map((abs, i) => (
            <MenuItem key={i} value={abs.value}>
              {abs.text}
            </MenuItem>
          ))}
        </Select>
      </div>
    );
  }
  return <div className={styles.title}></div>;
}
