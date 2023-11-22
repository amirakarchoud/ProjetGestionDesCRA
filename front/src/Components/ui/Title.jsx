import styles from './styles/Title.module.css';
function Title({ title }) {
  return (
    <div className={styles.title}>
      <div className={styles.text}>{title}</div>
      <div className={styles.underline}></div>
    </div>
  );
}

export default Title;
