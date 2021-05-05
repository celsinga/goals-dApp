import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import styles from './index.css';
import Paper from '@material-ui/core/Paper';
import { useAppDispatch } from '../../store';
import { activeGoalsSelector } from '../../slices/goals';
import { useHistory } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import DoneOutlineOutlinedIcon from '@material-ui/icons/DoneOutlineOutlined';
import { complete } from '../../slices/goals';
import AddTask from '../AddTask';
import TaskList from '../TaskList';


export default function Goal() {
  const dispatch = useAppDispatch();
  const activeGoals = useSelector(activeGoalsSelector);
  const history = useHistory();

  const { id } = useParams<{ id: string }>();
  const goal = activeGoals.find((v) => v.id === parseInt(id));
  const currentDate = new Date;

  if (!goal) return null;

  async function handleCompleteClick() {
    await dispatch(complete(goal!.id));
    history.push('/');
  };

  console.log("current", currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear())

  // const goalDeadline = goal.goal.deadline;
  // const difference = goalDeadline - currentDate.getTime();
  // console.log(Math.ceil(difference / (1000 * 3600 * 24)));
  // const daysRemaining = 


  // const defaultDeadlineDate = new Date();
  // defaultDeadlineDate.setHours(0,0,0,0);
  // defaultDeadlineDate.setDate(defaultDeadlineDate.getDate() + 7);
  // defaultDeadlineDate.setMinutes(defaultDeadlineDate.getMinutes() - 
  //                                defaultDeadlineDate.getTimezoneOffset());
  // let defaultDeadline = defaultDeadlineDate.toISOString();


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
              
                <Typography style={{ color: '#eb4034', fontSize: '1em' }}>
                  {Math.ceil((new Date(goal.goal.deadline * 1000).getTime() - new Date().getTime()) / 86400000)} days remaining
                </Typography>
              
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
