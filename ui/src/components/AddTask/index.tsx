import { useState } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import { create } from '../../slices/tasks';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import styles from './index.css';
import { useAppDispatch } from '../../store';

export default function AddTask({ goalId }: { goalId: number }) {
  const dispatch = useAppDispatch();

  const [isCreating, setIsCreating] = useState(false);
  const [createDescription, setCreateDescription] = useState('');

  async function handleCreateSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();

    try {
      setIsCreating(false);
      unwrapResult(await dispatch(create({
        description: createDescription,
        goalId
      })));
    } catch (e) {
      console.error(e);
      // TODO: Handle this error
    }
    setIsCreating(false);
    setCreateDescription('');
  }

  return (
    <div className={styles.addCtr}>
      <form onSubmit={handleCreateSubmit} className={styles.addForm}>
        <TextField
          type="text"
          name="description"
          fullWidth
          label="What's your next task?"
          onChange={(ev) => setCreateDescription(ev.target.value)}
          value={createDescription}
        />
        <div className={styles.secondRow}>
          <div>
            <Button
              type="submit"
              color='primary'
              variant='contained'
              value={isCreating ? 'Creating...' : 'Create'}
              disabled={isCreating || !createDescription}
            >
              Add Task
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
