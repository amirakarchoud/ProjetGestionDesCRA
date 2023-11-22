import styles from './styles/Navigation.module.css';
import { NavLink } from 'react-router-dom';

function Navigation() {
  const user = 'user';
  return (
    <nav>
      <ul className={styles.list}>
        <li>
          <NavLink
            to={`/calendar/${user}`}
            className={({isActive}) => [isActive ? styles.activeLink : "", styles.link].join(" ")}
          >Calendar</NavLink>
        </li>
        <li>
          <NavLink
            to="/projects"
            className={({isActive}) => [isActive ? styles.activeLink : "", styles.link].join(" ")}
          >Projects</NavLink>
        </li>
        <li>
          <NavLink
            to="/admin"
            className={({isActive}) => [isActive ? styles.activeLink : "", styles.link].join(" ")}
          >Admin</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation