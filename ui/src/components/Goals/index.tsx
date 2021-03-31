import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import GoalsList from '../GoalsList';
import Goal from '../Goal'
import './index.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

export default function Goals() {
  

  return (
    <React.Fragment>
      <div className="homepage">
      <CssBaseline />
      <Container className="goals-main" maxWidth="md">
        <Typography className="goals-header"><div contentEditable="true">2021 Goals ✏️</div></Typography>
        <div className="goals-parent" style={{ backgroundColor: '#444444', borderRadius: '20px' }}>
          <Router>
            <Switch>
              <Route path="/">
                <GoalsList />
              </Route>
              <Route path="/goal">
                <Goal />
              </Route>
            </Switch>
          </Router>
        </div>
      </Container>
      </div>
    </React.Fragment>
  );
}
