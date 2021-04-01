import { useEffect, useState } from 'react';
import './App.css';
import { unwrapResult } from '@reduxjs/toolkit';
import { init as ethInit } from '../slices/eth';
import { init as goalsInit } from '../slices/goals';
import Navbar from '../components/Navbar';
import Goals from '../components/Goals';
import { useAppDispatch } from '../store';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { ThemeProvider } from '@material-ui/core/styles';

function App() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const theme = createMuiTheme({
    palette: { type: 'dark' }
  });

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
    <ThemeProvider theme={theme}>
      <div>
        <Navbar />
        <Goals />
      </div>
    </ThemeProvider>
  );
}

export default App;
