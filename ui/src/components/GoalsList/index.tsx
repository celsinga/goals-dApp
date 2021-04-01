import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store';
import { create,activeGoalsSelector } from '../../slices/goals';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import styles from './index.css';

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
  }

  console.log(styles);

  const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
        backgroundColor: 'white',
        borderRadius: '10px'
      },
    },
  }));

  const classes = useStyles();

  return (
    <div className={styles.goalsList}>
      {activeGoals.length === 0 ? 'No goals!' : (
        <ul>
          {activeGoals.map((v) => (
            <li key={v.id}>{`Goal #${v.id}: ${v.goal.description}`}</li>
          ))}
        </ul>
      )}
      <form onSubmit={handleCreateSubmit} className={classes.root}>
        <TextField
          type="text"
          name="description"
          id="filled-required"
          label="New Goal"
          variant="filled"
          onChange={(ev) => setCreateDescription(ev.target.value)}
          value={createDescription}
        />
        <input
          type="submit"
          value={isCreating ? 'Creating...' : 'Create'}
          disabled={isCreating}
        />
      </form>
    </div>
  );
}

export default GoalsList;
