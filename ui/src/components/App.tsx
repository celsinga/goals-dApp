import { useEffect, useState } from 'react';
import './App.css';
import { unwrapResult } from '@reduxjs/toolkit'
import GoalsList from './GoalsList';
import { init as ethInit } from '../slices/eth';
import { init as goalsInit } from '../slices/goals';
import { useAppDispatch } from '../store';

function App() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    (async () => {
      try {
        unwrapResult(await dispatch(ethInit()));
        unwrapResult(await dispatch(goalsInit()));
        setIsLoading(false);
      } catch (e) {
        console.error('Failed to init!');
        console.error(e);
      }
    })();
  }, [dispatch]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="App">
      <GoalsList />
    </div>
  );
}

export default App;
