import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import guava from '../guava.svg';
import './navbar.scss';

export default function Navbar() {

  return (
    <div className="navbar">
      <AppBar position="static">
        <Toolbar className="toolbar">
          <div>
            <IconButton edge="start" className="logo" color="inherit" aria-label="menu">
              <img src={guava} alt="app-logo" />
              <Typography variant="h6" className="app-name">
              GoalSlicer™
              </Typography>
            </IconButton>
          </div>
          <div>
            <Button className="login" color="inherit">Login</Button>
            <Button className="login" color="inherit">Sign Up</Button>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}