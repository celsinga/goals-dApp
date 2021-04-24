import React, { useEffect, useState } from 'react';
import styles from './index.css';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { TaskWithId } from '../../services/tasks';
import { listActive, updateDone, remove, tasksSelector } from '../../slices/tasks';
import { useHistory } from 'react-router-dom';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useParams } from 'react-router-dom';
import EditTaskDialog from '../EditTaskDialog';

export default function TaskList({ goalId }: { goalId: number }) {
  const [taskMenuInfo, setTaskMenuInfo] = useState<{ anchor: HTMLElement, id: number } | null>(null);
  const [editTask, setEditTask] = useState<{ initContent: string, id: number } | null>(null);
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
    setTaskMenuInfo(null);
    await dispatch(remove({ goalId, taskId }));
  }

  function handleEditTaskClick(taskId: number) {
    setTaskMenuInfo(null);
    setEditTask({
      id: taskId,
      initContent: tasks.find((v) => v.id === taskId)!.task.description
    });
  }

  return (
    <div className={styles.root}>
      <Typography variant='subtitle1'>
        Goal Tasks
      </Typography>
      <EditTaskDialog
        goalId={goalId}
        taskId={!!editTask ? editTask.id : 0}
        initContent={!!editTask ? editTask.initContent : ''}
        onClose={() => setEditTask(null)}
      />
      <Menu
        anchorEl={!!taskMenuInfo ? taskMenuInfo.anchor : null}
        open={!!taskMenuInfo}
        onClose={() => setTaskMenuInfo(null)}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        getContentAnchorEl={null}
      >
        <MenuItem onClick={() => handleEditTaskClick(taskMenuInfo!.id)}>Edit</MenuItem>
        <MenuItem onClick={() => {}}>Sell work unit</MenuItem>
        <MenuItem onClick={() => handleRemoveTaskClick(taskMenuInfo!.id)}>Delete</MenuItem>
      </Menu>
      {!!tasks && tasks.map((v) => (
        <div key={v.id}>
          <div className={styles.task}>
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
            <div>
              <IconButton
                className={styles.menuBtn}
                onClick={(ev) => setTaskMenuInfo({ anchor: ev.target as HTMLElement, id: v.id })}
              >
                <MoreVertIcon fontSize='small' />
              </IconButton>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
