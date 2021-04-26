import { useEffect, useState } from 'react';
import './App.css';
import { unwrapResult } from '@reduxjs/toolkit';
import { init as ethInit } from '../slices/eth';
import { init as goalsInit } from '../slices/goals';
import { init as tasksInit } from '../services/tasks';
import { init as workUnitsInit } from '../services/workunits';
import { list as workUnitsList } from '../slices/workunits';
import Navbar from './Navbar';
import AppContent from './AppContent';
import Notification from './Notification';
import { useAppDispatch } from '../store';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { ThemeProvider } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue'; 
import purple from '@material-ui/core/colors/purple'; 
import { BrowserRouter as Router } from 'react-router-dom';

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
        await tasksInit();
        await workUnitsInit();

        // TODO: this is temporary, pls remove at some point
        // unwrapResult(await dispatch(workUnitsList()));

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
        <Router>
          <Navbar />
          <AppContent />
          <Notification />
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
