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
      <AppBar position="static" style={{backgroundColor: '#7542f5'}}>
        <Toolbar className={styles.toolbar}>
          <div>
            <IconButton edge="start" className="logo" color="inherit" aria-label="menu">
              <img src={guava} alt="app-logo" />
              <Typography variant="h6" className={styles.appName}>
              GoalSlicer™
              </Typography>
            </IconButton>
          </div>
          <div>
            <Button className={styles.login} color="inherit">Login</Button>
            <Button className={styles.login} color="inherit">Sign Up</Button>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
