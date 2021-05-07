import { useEffect, useState } from 'react';
import './App.css';
import { unwrapResult } from '@reduxjs/toolkit';
import { init as ethInit } from '../slices/eth';
import { init as goalsInit } from '../slices/goals';
import { init as tasksInit } from '../services/tasks';
import { init as workUnitsInit } from '../services/workunits';
import Navbar from './Navbar';
import AppContent from './AppContent';
import Notification from './Notification';
import { useAppDispatch } from '../store';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { ThemeProvider } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue'; 
import purple from '@material-ui/core/colors/purple'; 
import { BrowserRouter, HashRouter } from 'react-router-dom';
import PreloaderView from './PreloaderView';

declare const USE_HASH_ROUTER: string;

function App() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
      } catch (e) {
        setError(e);
        console.error('Failed to init!');
        console.error(e);
      }
      setIsLoading(false);
    })();
  }, [dispatch]);

  if (isLoading || !!error) {
    return (
      <ThemeProvider theme={theme}>
        <PreloaderView error={error} /> 
      </ThemeProvider>
    );
  }

  const content = (
    <>
      <Navbar />
      <AppContent />
      <Notification />
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <div>
        {!!USE_HASH_ROUTER ? (
          <HashRouter>
            {content}
          </HashRouter>
        ) : (
          <BrowserRouter>
            {content}
          </BrowserRouter>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
