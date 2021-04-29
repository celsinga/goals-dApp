import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import GoalsList from '../GoalsList';
import WorkUnits from '../WorkUnits';
import styles from './index.css';
import Goal from '../Goal';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

const MANTRA_STORAGE_KEY = 'goals_mantra';

export default function AppContent() {

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
    <>
      <div className="homepage">
        <CssBaseline />
        <Container className={styles.goalsMain} maxWidth="lg">
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
            <Switch>
              <Route exact path="/">
                <GoalsList />
              </Route>
              <Route path="/goal/:id">
                <Goal />
              </Route>
              <Route path="/workunits">
                <WorkUnits />
              </Route>
            </Switch>
          </div>
        </Container>
      </div>
    </>
  );
}
