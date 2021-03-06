import { useState } from 'react';
import { addToPending, createBulk } from '../../slices/goals';
import { Goal, GoalWithId } from '../../services/goals';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import styles from './index.css';
import { useAppDispatch } from '../../store';

export default function AddGoal({ pendingGoals, saveInProgress }: { pendingGoals: Goal[], saveInProgress: boolean }) {
  const dispatch = useAppDispatch();

  const defaultDeadline = new Date();
  defaultDeadline.setDate(defaultDeadline.getDate() + 7);
  defaultDeadline.setMinutes(defaultDeadline.getMinutes() -
                             defaultDeadline.getTimezoneOffset());

  const [createDescription, setCreateDescription] = useState('');
  const [deadline, setDeadline] = useState(defaultDeadline.toISOString().split('T')[0]);

  async function handleCreateSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();

    const deadlineDate = new Date(deadline);
    deadlineDate.setMinutes(deadlineDate.getMinutes() +
                            deadlineDate.getTimezoneOffset());
    dispatch(addToPending({
      description: createDescription,
      deadline: Math.round(deadlineDate.getTime() / 1000)
    }));

    setCreateDescription('');
  }

  function handleSaveAll() {
    dispatch(createBulk(pendingGoals.slice().reverse()));
  }

  return (
    <Paper className={styles.addCtr}>
      <form onSubmit={handleCreateSubmit} className={styles.addForm}>
        <TextField
          type="text"
          name="description"
          fullWidth
          label="What's your next goal?"
          onChange={(ev) => setCreateDescription(ev.target.value)}
          value={createDescription}
        />
        <div className={styles.secondRow}>
          <TextField
            type="date"
            value={deadline}
            onChange={(ev) => setDeadline(ev.target.value)}
            label="Deadline"
            InputLabelProps={{
              shrink: true
            }}
          />
          <div className={styles.grow}></div>
          <div className={styles.btnCtr}>
            <Button
              type="submit"
              color='primary'
              variant='contained'
              disabled={!createDescription || !new Date(deadline).getTime() || saveInProgress}
            >
              Add
            </Button>
            <Button
              color='primary'
              variant='contained'
              disabled={pendingGoals.length === 0 || saveInProgress}
              onClick={handleSaveAll}
            >
              Save All
            </Button>
          </div>
        </div>
      </form>
    </Paper>
  );
}
