import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import guava from '../../assets/guava.svg';
import styles from './index.css';

export default function Navbar() {

  return (
    <div className={styles.navbar}>
      <AppBar position="static">
        <Toolbar className={styles.toolbar}>
          <div>
            <Link to="/" className={styles.rootLink}>
              <IconButton edge="start" className="logo" color="inherit" aria-label="menu">
                <img src={guava} alt="app-logo" />
                <Typography variant="h6" className={styles.appName}>
                GoalSlicer™
                </Typography>
              </IconButton>
            </Link>
          </div>
          <div>
            <Button className={styles.login} color="inherit">Pages</Button>
            <Button className={styles.login} color="inherit">Settings</Button>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
