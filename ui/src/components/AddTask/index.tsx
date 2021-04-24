import { useState } from 'react';
import { create } from '../../slices/tasks';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import styles from './index.css';
import { useAppDispatch } from '../../store';

export default function AddTask({ goalId }: { goalId: number }) {
  const dispatch = useAppDispatch();

  const [createDescription, setCreateDescription] = useState('');

  async function handleCreateSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();

    dispatch(create({
      description: createDescription,
      goalId
    }));
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
              disabled={!createDescription}
            >
              Add Task
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
