import { useEffect } from 'react';
import './App.css';
import { unwrapResult } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux';
import { init as ethInit, accountsSelector } from '../slices/eth';
import { useAppDispatch } from '../store';

function App() {
  const ethAccounts = useSelector(accountsSelector);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    (async () => {
      try {
        unwrapResult(await dispatch(ethInit()));
      } catch (e) {
        console.error('Failed to init eth!');
        console.error(e);
      }
    })();
  }, [dispatch]);

  console.log(ethAccounts);

  return (
    <div className="App">
      
    </div>
  );
}

export default App;
