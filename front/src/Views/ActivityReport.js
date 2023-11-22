import styles from './styles/ActivityReport.module.css';
import Title from 'Components/ui/Title';
import ActivityReportTable from '../Components/ui/ActivityReportTable';

function ActivityReport() {
  return (
    <main className={styles.main}>
      <Title title={'Activity Report'} />
      <ActivityReportTable />
    </main>
  );
}

export default ActivityReport;
