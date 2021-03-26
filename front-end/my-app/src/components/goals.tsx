import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import './goals.scss'

export default function Goals() {
  return (
    <React.Fragment>
      <div className="homepage">
      <CssBaseline />
      <Container className="goals-main" maxWidth="md">
        <Typography className="goals-header">#myGoals</Typography>
        <div style={{ backgroundColor: '#444444', height: '80vh', borderRadius: '20px' }}>
          <ul>
            
          </ul>
        </div>
      </Container>
      </div>
    </React.Fragment>
  );
}