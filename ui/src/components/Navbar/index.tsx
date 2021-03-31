import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import guava from '../../assets/guava.svg';
import './index.scss';

export default function Navbar() {

  return (
    <div className="navbar">
      <AppBar position="static" style={{backgroundColor: '#7542f5'}}>
        <Toolbar className="toolbar">
          <div>
            <a href="http://localhost:3000" style={{textDecoration: 'none', color: 'white'}}>
            <IconButton edge="start" className="logo" color="inherit" aria-label="menu">
              <img src={guava} alt="app-logo" />
              <Typography variant="h6" className="app-name">
              GoalSlicer™
              </Typography>
            </IconButton>
            </a>
          </div>
          <div>
            <Button className="login" color="inherit">Pages</Button>
            <Button className="login" color="inherit">Settings</Button>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
