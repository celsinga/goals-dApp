import { useState, useEffect } from 'react';
import styles from './index.css';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
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
  const [error, setError] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (!!initContent) {
      setContent(initContent.slice());
    }
  }, [goalId, taskId, initContent]);
  
  async function handleSaveClick() {
    setError('');
    setIsSaving(true);
    try {
      unwrapResult(await dispatch(updateDesc({ goalId, taskId, description: content })));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      onClose();
      setContent('');
    } catch (e) {
      setError(e.toString());
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCancelClick() {
    onClose();
    setContent('');
    setError('');   
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
        <Button color='primary' disabled={isSaving} onClick={handleCancelClick}>
          Cancel
        </Button>
        {!isSaving ? (
          <Button color='primary' disabled={!content} onClick={handleSaveClick}>
            Save
          </Button>
        ) : (
          <CircularProgress size={30} className={styles.progress} />
        )}
      </DialogActions>
    </Dialog>
  );
}
