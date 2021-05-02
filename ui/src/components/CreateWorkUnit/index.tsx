import { useState } from 'react';
import styles from './index.css';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useAppDispatch } from '../../store';
import { create } from '../../slices/workunits';

interface IProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateWorkUnit({ open, onClose }: IProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const dispatch = useAppDispatch();
  const [desc, setDesc] = useState('');
  const [buyer, setBuyer] = useState('');
  const [errors, setErrors] = useState<{ desc?: string, buyer?: string }>({});

  function handleClose() {
    setDesc('');
    setBuyer('');
    setErrors({});
    onClose();
  }

  function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (!desc) {
      setErrors({ desc: 'Cannot be blank' });
    } else if (!buyer) {
      setErrors({ buyer: 'Cannot be blank' });
    } else if (!buyer.startsWith('0x') || buyer.length !== 42) {
      setErrors({ buyer: 'Enter valid address' });
    } else {
      dispatch(create({ description: desc, buyer }));
      handleClose();
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth='md'
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Sell work unit</DialogTitle>
        <DialogContent className={styles.dialogContent}>
          <TextField
            value={desc}
            multiline
            label='Description'
            className={styles.desc}
            autoFocus
            placeholder='Enter a description of the services to be rendered...'
            onChange={(ev) => setDesc(ev.target.value)}
            error={!!errors.desc}
            helperText={errors.desc}
            fullWidth
          />
          <TextField
            value={buyer}
            label='Buyer address'
            onChange={(ev) => setBuyer(ev.target.value)}
            error={!!errors.buyer}
            helperText={errors.buyer}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button type='submit' color='primary'>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
