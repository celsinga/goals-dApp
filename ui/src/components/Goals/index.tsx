import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import GoalsList from '../GoalsList';
import styles from './index.css';
import Goal from '../Goal'
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
        <Container className={styles.goalsMain} maxWidth="md">
          <Typography className={styles.goalsHeader}>
            <div contentEditable="true">2021 Goals ✏️</div>
          </Typography>
          <div className={styles.goalsParent}>
            <Router>
              <Switch>
                <Route exact path="/">
                  <GoalsList />
                </Route>
                <Route path="/goal/:id">
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
