import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { notifySelector } from '../../slices/notification';
import { useAppDispatch } from '../../store';
import { clear } from '../../slices/notification';

export default function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const notifyInfo = useSelector(notifySelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!!notifyInfo.msg) {
      setIsOpen(true);
    }
  }, [notifyInfo.msg]);

  function handleClose() {
    setIsOpen(false);
    // add timeout to prevent transition problem
    setTimeout(() => dispatch(clear()), 250);
  }

  return (
    <Snackbar
      open={isOpen && !!notifyInfo.msg}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity={notifyInfo.severity}
        elevation={6}
        variant='filled'
      >
        {notifyInfo.msg}
      </Alert>
    </Snackbar>
  );
}
