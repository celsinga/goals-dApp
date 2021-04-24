import { useState, useEffect } from 'react';
import styles from './index.css';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from '../../store';
import { updateDesc } from '../../slices/tasks';

interface IProps {
  goalId: number;
  taskId: number;
  initContent: string;
  onClose: () => void;
}

export default function EditTaskDialog({ goalId, taskId, initContent, onClose }: IProps) {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    if (!!initContent) {
      setContent(initContent.slice());
    }
  }, [goalId, taskId, initContent]);
  
  async function handleSaveClick() {
    dispatch(updateDesc({ goalId, taskId, description: content }));
    onClose();
    setContent('');
  }

  async function handleCancelClick() {
    onClose();
    setContent('');
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      open={!!goalId && !!taskId && !!initContent}
      onClose={handleCancelClick}
      maxWidth='sm'
      classes={{ paper: styles.dialogPaper }}
    >
      <DialogTitle>Edit task</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label='Description'
          value={content}
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setContent(ev.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button color='primary' onClick={handleCancelClick}>
          Cancel
        </Button>
        <Button color='primary' disabled={!content} onClick={handleSaveClick}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
