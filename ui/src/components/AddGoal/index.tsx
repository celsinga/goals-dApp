import { useState } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import { create } from '../../slices/goals';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import styles from './index.css';
import { useAppDispatch } from '../../store';

export default function AddGoal() {
  const dispatch = useAppDispatch();

  const defaultDeadlineDate = new Date();
  defaultDeadlineDate.setHours(0,0,0,0);
  defaultDeadlineDate.setDate(defaultDeadlineDate.getDate() + 7);
  defaultDeadlineDate.setMinutes(defaultDeadlineDate.getMinutes() - 
                                 defaultDeadlineDate.getTimezoneOffset());
  let defaultDeadline = defaultDeadlineDate.toISOString();

  const [isCreating, setIsCreating] = useState(false);
  const [createDescription, setCreateDescription] = useState('');
  const [deadline, setDeadline] = useState(defaultDeadline.substring(0, defaultDeadline.length - 8));

  async function handleCreateSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();

    try {
      setIsCreating(false);
      unwrapResult(await dispatch(create({
        description: createDescription,
        deadline: Math.round(new Date(deadline).getTime() / 1000)
      })));
    } catch (e) {
      console.error(e);
      // TODO: Handle this error
    }
    setIsCreating(false);
    setCreateDescription('');
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
          <div>
            <Button
              type="submit"
              color='primary'
              variant='contained'
              value={isCreating ? 'Creating...' : 'Create'}
              disabled={isCreating || !createDescription || !new Date(deadline).getTime()}
            >
              Add Goal
            </Button>
          </div>
        </div>
      </form>
    </Paper>
  );
}
