import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import guava from '../../assets/guava.svg';
import styles from './index.css';
import { notifySelector } from '../../slices/notification';
import { useSelector } from 'react-redux';

export default function Navbar() {
  const notifyInfo = useSelector(notifySelector);

  return (
    <div className={styles.navbar}>
      <AppBar position="fixed">
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
          {notifyInfo.inProgress && (
            <Tooltip title={notifyInfo.msg || ''}>
              <CircularProgress size={30} />
            </Tooltip>
          )}
          <Link to="/workunits" className={styles.rootLink}>
            <Button>Work Units</Button>
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}
