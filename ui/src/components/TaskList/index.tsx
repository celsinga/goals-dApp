import React, { useEffect } from 'react';
import styles from './index.css';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { TaskWithId } from '../../services/tasks';
import { listActive, updateDone, remove, tasksSelector } from '../../slices/tasks';
import { useHistory } from 'react-router-dom';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import { useParams } from 'react-router-dom';

export default function TaskList({ goalId }: { goalId: number }) {
  const tasks: TaskWithId[] = useSelector(tasksSelector(goalId));
  const dispatch = useAppDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(listActive(goalId));
  }, [goalId]);

  async function handleCheckChange(ev: React.ChangeEvent<HTMLInputElement>, taskId: number) {
    await dispatch(updateDone({
      goalId,
      taskId,
      done: ev.target.checked
    }));
  }

  async function handleRemoveTaskClick(taskId: number) {
    await dispatch(remove({ goalId, taskId }));
  }

  return (
    <div className={styles.root}>
      <Typography variant='subtitle1'>
        Goal Tasks
      </Typography>
      {!!tasks && tasks.map((v) => (
        <div key={v.id}>
          <div style={{display: 'flex', justifyContent: 'space-between' }}>
            <FormControlLabel
              label={v.task.description}
              control={
                <Checkbox
                  checked={v.task.done}
                  onChange={(ev) => handleCheckChange(ev, v.id)}
                  name={`done_${v.id}`}
                />
              }
            />
            <IconButton onClick={() => handleRemoveTaskClick(v.id)}>
              <ClearIcon />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  );
}
