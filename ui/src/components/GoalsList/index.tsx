import { useSelector } from 'react-redux';
import {
  activeGoalsSelector,
  pendingGoalsSelector,
  removeFromPending,
  saveInProgSelector
} from '../../slices/goals';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import ScheduleIcon from '@material-ui/icons/Schedule';
import styles from './index.css';
import { Link } from "react-router-dom";
import AddGoal from '../AddGoal';
import { useAppDispatch } from '../../store';

export default function GoalsList() {
  const dispatch = useAppDispatch();

  const activeGoals = useSelector(activeGoalsSelector);
  const pendingGoals = useSelector(pendingGoalsSelector);
  const saveInProgress = useSelector(saveInProgSelector);

  function handlePendingDelete(index: number) {
    dispatch(removeFromPending(index));
  }

  return (
    <div>
      <AddGoal
        pendingGoals={pendingGoals}
        saveInProgress={saveInProgress}
      />
      {activeGoals.length === 0 && pendingGoals.length == 0 ? (
        <div className={styles.goalsEmpty}>
          <Typography>No goals! Time to get to work!</Typography>
        </div>
      ) : (
        <div className={styles.goalsCtr}>
          <Grid container spacing={3}>
            {pendingGoals.map((v, k) => (
              <Grid item key={k} xs={12} sm={4} md={3}>
                <Card className={styles.pendingGoalCard}>
                  <CardContent className={styles.content}>
                    <IconButton
                      className={styles.deleteBtn}
                      onClick={() => handlePendingDelete(k)}
                      disabled={saveInProgress}
                    >
                      <CloseIcon />
                    </IconButton>
                    <Typography className={styles.goalId} color='textSecondary'>
                      Pending Goal 
                    </Typography>
                    <Typography className={styles.desc}>
                      {v.description}
                    </Typography>
                    <div className={styles.deadline}>
                      <ScheduleIcon />
                      <Typography color='textSecondary'>
                        {new Date(v.deadline * 1000).toLocaleDateString()}
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {activeGoals.map((v) => (
              <Grid item key={v.id} xs={12} sm={4} md={3}>
                <Link to={`/goal/${v.id}`} className={styles.goalLink}>
                <Card className={styles.goalCard}>
                    <CardActionArea className={styles.goalActionArea}>
                      <CardContent className={styles.content}>
                        <Typography className={styles.goalId} color='textSecondary'>
                          {`Goal #${v.id}`}
                        </Typography>
                        <Typography className={styles.desc}>
                          {v.goal.description}
                        </Typography>
                        <div className={styles.deadline}>
                          <ScheduleIcon />
                          <Typography color='textSecondary'>
                            {new Date(v.goal.deadline * 1000).toLocaleDateString()}
                          </Typography>
                        </div>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </div>
      )}
    </div>
  );
}
