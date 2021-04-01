import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import GoalsList from '../GoalsList';
import styles from './index.css';

export default function Goals() {
  

  return (
    <React.Fragment>
      <div className="homepage">
      <CssBaseline />
      <Container className={styles.goalsMain} maxWidth="md">
        <Typography className={styles.goalsHeader}>
          <div contentEditable="true">#neverStopGrinding</div>
        </Typography>
        <div className={styles.goalsParent}>
          <GoalsList />
        </div>
      </Container>
      </div>
    </React.Fragment>
  );
}
