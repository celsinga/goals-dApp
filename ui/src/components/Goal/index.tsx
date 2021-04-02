import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
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
  console.log(goal.id)

  return (
    <div>
      <Card className={styles.goalCard}>
            <CardActionArea className={styles.goalActionArea}>
              <CardContent>
                <Typography className={styles.goalId} color='textSecondary'>
                  {`Goal #${goal.id}`}
                </Typography>
                <Typography>
                  {goal.goal.description}
                </Typography>
              </CardContent>
            </CardActionArea>
      </Card>
    </div>
  );
}
