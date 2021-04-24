import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { notifySelector } from '../../slices/notification';
import { useAppDispatch } from '../../store';

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
  }

  return (
    <Snackbar
      open={isOpen && !!notifyInfo.msg}
      autoHideDuration={6000}
      onClose={() => setIsOpen(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={() => setIsOpen(false)}
        severity={notifyInfo.severity}
        elevation={6}
        variant='filled'
      >
        {notifyInfo.msg}
      </Alert>
    </Snackbar>
  );
}
