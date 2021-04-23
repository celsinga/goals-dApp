import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import styles from './index.css';
import Paper from '@material-ui/core/Paper';
import { useAppDispatch } from '../../store';
import { activeGoalsSelector } from '../../slices/goals';
import { useHistory } from 'react-router-dom';
import pluralize from 'pluralize';
import IconButton from '@material-ui/core/IconButton';
import DoneOutlineOutlinedIcon from '@material-ui/icons/DoneOutlineOutlined';
import { complete } from '../../slices/goals';
import AddTask from '../AddTask';
import TaskList from '../TaskList';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


export default function Goal() {
  const dispatch = useAppDispatch();
  const activeGoals = useSelector(activeGoalsSelector);
  const history = useHistory();

  const { id } = useParams<{ id: string }>();
  const goal = activeGoals.find((v) => v.id === parseInt(id));
  const currentDate = new Date;

  if (!goal) return null;

  const monthsRemaining = (new Date(goal.goal.deadline * 1000).getMonth()) - (currentDate.getMonth());

  async function handleCompleteClick() {
    await dispatch(complete(goal!.id));
    history.push('/');
  };

  const defaultDeadlineDate = new Date();
  defaultDeadlineDate.setHours(0,0,0,0);
  defaultDeadlineDate.setDate(defaultDeadlineDate.getDate() + 7);
  defaultDeadlineDate.setMinutes(defaultDeadlineDate.getMinutes() - 
                                 defaultDeadlineDate.getTimezoneOffset());
  let defaultDeadline = defaultDeadlineDate.toISOString();

  const [isCreating, setIsCreating] = useState(false);

  const changeDate = function() {
    return (
    <div>
      <TextField
                type="date"
                value={deadline}
                onChange={(ev) => setDeadline(ev.target.value)}
                label="Deadline"
                InputLabelProps={{
                  shrink: true
                }}
              />
              <Button
              type="submit"
              color='primary'
              variant='contained'
              value={isCreating ? 'Creating...' : 'Create'}
              disabled={ !new Date(deadline).getTime()}
              >
               Update Deadline
          </Button>
    </div>
    )
  }

  const [deadline, setDeadline] = useState(defaultDeadline.substring(0, defaultDeadline.length - 8));

  return (
    <div>
      <Paper className={styles.goalPaper}>
        <div className={styles.header}>
          <div>
            <Typography className={styles.goalId} color='textSecondary'>
              {`Goal #${goal.id}`}
            </Typography>
            <div contentEditable="true"
              suppressContentEditableWarning
              >
              <Typography>
                {goal.goal.description}
              </Typography>
            </div>

            <div style={{display: 'flex'}}>
              {currentDate.getMonth() === new Date(goal.goal.deadline * 1000).getMonth() ? (
                <Typography style={{ color: '#eb4034', fontSize: '1em' }}>
                  {(new Date(goal.goal.deadline * 1000).getDate()) - (currentDate.getDate())} days remaining
                </Typography>
              ) : (
                <Typography style={{color: '#eb4034'}}>
                  {monthsRemaining} {pluralize('month', monthsRemaining)} remaining
                </Typography>
              )}
              <EditIcon onClick={changeDate} style={{color: '#eb4034', fontSize: '1.2em', marginLeft: '7px'}} />
            </div>
          </div>

          <div>
            <IconButton onClick={handleCompleteClick}>
              <DoneOutlineOutlinedIcon />
            </IconButton>
          </div>

        </div>

        <TaskList goalId={goal.id} />
        <AddTask goalId={goal.id} />
            
      </Paper>
    </div>
  );
}
