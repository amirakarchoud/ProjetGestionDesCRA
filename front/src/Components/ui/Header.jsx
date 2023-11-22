import styles from './styles/Header.module.css';
import Navigation from './Navigation';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../Utils/Routes';

function Header() {
  const navigate = useNavigate();
  const navigateHome = () => {
    navigate(routes.default);
  };

  return (
    <header className={styles.header}>
      <img
        className={styles.img}
        src="/images/logo-crapp.svg"
        alt="CRApp Logo"
        onClick={navigateHome}
      />
      <span className={styles.spacer}></span>
      <Navigation></Navigation>
      <span className={styles.spacer}></span>
      <Stack spacing={2} direction="row" className={styles.stack}>
        <Button
          color="primary"
          variant="contained"
          endIcon={<AddCircleOutlineOutlinedIcon />}
        >
          Create a project
        </Button>
        <Button
          color="primary"
          variant="outlined"
          startIcon={<SettingsOutlinedIcon />}
        >
          User
        </Button>
      </Stack>
    </header>
  );
}

export default Header;
