import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store';
import { create,activeGoalsSelector } from '../../slices/goals';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import styles from './index.css';
import { Link } from "react-router-dom";

function GoalsList() {
  const dispatch = useAppDispatch();
  const activeGoals = useSelector(activeGoalsSelector);

  const [isCreating, setIsCreating] = useState(false);
  const [createDescription, setCreateDescription] = useState('');

  async function handleCreateSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();

    try {
      setIsCreating(false);
      await dispatch(create({
        description: createDescription,
        deadline: Math.round(new Date().getTime() / 1000) + 3600
      }));
    } catch (e) {
      // TODO: Handle this error
    }
    setIsCreating(false);
    setCreateDescription('');
  }

  return (
    <div>

      <form onSubmit={handleCreateSubmit} className={styles.addForm}>
        <TextField
          type="text"
          name="description"
          fullWidth
          label="What's your next goal?"
          onChange={(ev) => setCreateDescription(ev.target.value)}
          value={createDescription}
        />
        <Button
          type="submit"
          color='primary'
          variant='contained'
          value={isCreating ? 'Creating...' : 'Create'}
          disabled={isCreating || !createDescription}
        >
          Add Goal
        </Button>
      </form>
      {activeGoals.length === 0 ? 'No goals!' : (
        <div className={styles.goalsCtr}>
          <Grid container spacing={3}>
            {activeGoals.map((v) => (
              <Grid item key={v.id} xs={12} sm={4} md={3}>
                <Link to={`/goal/${v.id}`} className={styles.goalLink}>
                  <Card className={styles.goalCard}>
                    <CardActionArea>
                      <CardContent>
                        <Typography className={styles.goalId} color='textSecondary'>
                          {`Goal #${v.id}`}
                        </Typography>
                        <Typography>
                          {v.goal.description}
                        </Typography>
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

export default GoalsList;
