import React from 'react';
import { useSelector } from 'react-redux';
// import { useAppDispatch } from '../../store';
import { activeGoalsSelector } from '../../slices/goals';
import './index.scss';

export default function Goal() {
  // const dispatch = useAppDispatch();
  // const activeGoals = useSelector(activeGoalsSelector);


  return (
    <div className="goals-list">
      <ul>
        <li>Test</li>
      </ul>
    </div>
  );
}