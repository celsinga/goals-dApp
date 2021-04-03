import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Paper from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import styles from './index.css';
// import { useAppDispatch } from '../../store';
import { activeGoalsSelector } from '../../slices/goals';

export default function Goal() {
  // const dispatch = useAppDispatch();
  const activeGoals = useSelector(activeGoalsSelector);

  const { id } = useParams<{ id: string }>();
  const goal = activeGoals.find((v) => v.id === parseInt(id));

  if (!goal) return null;

  return (
    <div>
      <Paper className={styles.goalPaper}>
        <Typography className={styles.goalId} color='textSecondary'>
          {`Goal #${goal.id}`}
        </Typography>
        <Typography>
          {goal.goal.description}
        </Typography>
      </Paper>
    </div>
  );
}
