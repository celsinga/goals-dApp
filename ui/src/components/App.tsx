import { useEffect, useState } from 'react';
import './App.css';
import { unwrapResult } from '@reduxjs/toolkit';
import { init as ethInit } from '../slices/eth';
import { init as goalsInit } from '../slices/goals';
import { init as tasksInit } from '../slices/tasks';
import Navbar from '../components/Navbar';
import AppContent from '../components/AppContent';
import { useAppDispatch } from '../store';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { ThemeProvider } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue'; 
import purple from '@material-ui/core/colors/purple'; 

function App() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const theme = createMuiTheme({
    palette: {
      primary: blue,
      secondary: purple,
      type: 'dark'
    }
  });

  useEffect(() => {
    (async () => {
      try {
        unwrapResult(await dispatch(ethInit()));
        unwrapResult(await dispatch(goalsInit()));
        unwrapResult(await dispatch(tasksInit()));
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
        <AppContent />
      </div>
    </ThemeProvider>
  );
}

export default App;
