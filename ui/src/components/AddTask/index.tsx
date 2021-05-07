import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  addToPending,
  createBulk,
  pendingSelector,
  tasksSelector,
  saveInProgSelector
} from '../../slices/tasks';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import styles from './index.css';
import { useAppDispatch } from '../../store';

export default function AddTask({ goalId }: { goalId: number }) {
  const dispatch = useAppDispatch();

  const [createDescription, setCreateDescription] = useState('');
  const tasks = useSelector(tasksSelector(goalId));
  const pendingTasks = useSelector(pendingSelector(goalId));
  const saveInProgress = useSelector(saveInProgSelector);

  function handleAddSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();

    dispatch(addToPending({
      desc: createDescription,
      goalId
    }));
    setCreateDescription('');
  }

  function handleCreate() {
    dispatch(createBulk({ goalId, descriptions: pendingTasks }));
  }

  return (
    <div className={styles.addCtr}>
      <form onSubmit={handleAddSubmit} className={styles.addForm}>
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
              disabled={!createDescription || saveInProgress}
            >
              Add Task
            </Button>
          </div>
          <Button
            color='primary'
            variant='contained'
            disabled={pendingTasks.length === 0 || saveInProgress}
            onClick={handleCreate}
          >
            Save All
          </Button>
        </div>
      </form>
    </div>
  );
}
