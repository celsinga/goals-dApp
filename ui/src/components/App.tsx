import { useEffect, useState } from 'react';
import styles from './App.css';
import { unwrapResult } from '@reduxjs/toolkit';
import { init as ethInit } from '../slices/eth';
import { init as goalsInit } from '../slices/goals';
import Navbar from '../components/Navbar';
import Goals from '../components/Goals';
import { useAppDispatch } from '../store';

function App() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  console.log(styles);
  
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
    <div>
      <Navbar />
      <Goals />
    </div>
  );
}

export default App;
