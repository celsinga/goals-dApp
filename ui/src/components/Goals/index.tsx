import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import GoalsList from '../GoalsList';
import styles from './index.css';
import Goal from '../Goal';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

const MANTRA_STORAGE_KEY = 'goals_mantra';

export default function Goals() {

  let mantraSaveTimeout: any = null;

  const handleMantraChange = (ev: React.FormEvent<HTMLDivElement>) => {
    if (!!mantraSaveTimeout) {
      clearTimeout(mantraSaveTimeout);
      mantraSaveTimeout = null;
    }
    
    mantraSaveTimeout = setTimeout(() => {
      window.localStorage.setItem(MANTRA_STORAGE_KEY, (ev.target as HTMLDivElement).innerText);
    }, 500);
  }

  let initMantra = window.localStorage.getItem(MANTRA_STORAGE_KEY);
  if (initMantra === null) {
    initMantra = `${new Date().getFullYear()} Goals️ ✏️ `;
  }

  return (
    <React.Fragment>
      <div className="homepage">
        <CssBaseline />
        <Container className={styles.goalsMain} maxWidth="md">
          <Card className={styles.goalsHeader}>
            <div
              contentEditable="true"
              onInput={handleMantraChange}
              suppressContentEditableWarning
            >
              {initMantra}
            </div>
          </Card>
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
