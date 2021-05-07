import React, { useEffect, useState } from 'react';
import styles from './index.css';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {
  listActive,
  updateDone,
  remove,
  tasksSelector,
  pendingSelector,
  removeFromPending,
  saveInProgSelector
} from '../../slices/tasks';
import { useHistory } from 'react-router-dom';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import EditTaskDialog from '../EditTaskDialog';

export default function TaskList({ goalId }: { goalId: number }) {
  const [taskMenuInfo, setTaskMenuInfo] = useState<{ anchor: HTMLElement, id: number } | null>(null);
  const [editTask, setEditTask] = useState<{ initContent: string, id: number } | null>(null);
  const tasks = useSelector(tasksSelector(goalId));
  const pendingTasks = useSelector(pendingSelector(goalId));
  const saveInProgress = useSelector(saveInProgSelector);
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

  function handlePendingTaskRemove(index: number) {
    dispatch(removeFromPending({ index, goalId }));
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
      {tasks.map((v) => (
        <div className={styles.task} key={v.id}>
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
      ))}
      {pendingTasks.map((v, k) => (
        <div className={styles.task} key={k}>
          <FormControlLabel
            label={v}
            control={
              <Checkbox
                checked={false}
                disabled
                name={`pendingdone_${k}`}
              />
            }
          /> 
          <div>
            <IconButton
              className={styles.menuBtn}
              disabled={saveInProgress}
              onClick={() => handlePendingTaskRemove(k)}
            >
              <CloseIcon fontSize='small' />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  );
}
