import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// import { useAppDispatch } from '../../store';
import { activeGoalsSelector } from '../../slices/goals';

export default function Goal() {
  // const dispatch = useAppDispatch();
  const activeGoals = useSelector(activeGoalsSelector);

  const { id } = useParams<{ id: string }>();
  const goal = activeGoals.find((v) => v.id === parseInt(id));

  if (!goal) return null;

  return (
    <div>
      <div>{goal.goal.description}</div>
      <ul>
        <li>Test</li>
      </ul>
    </div>
  );
}
