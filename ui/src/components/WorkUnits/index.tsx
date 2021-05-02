import { useState, useEffect } from 'react';
import styles from './index.css';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tab from '@material-ui/core/Tab';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store';
import { list as workUnitsList } from '../../slices/workunits';
import { buyingTokensSelector, sellingTokensSelector } from '../../slices/workunits';
import CreateWorkUnit from '../CreateWorkUnit';

export default function WorkUnits() {
  const [showingSelling, setShowingSelling] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const dispatch = useAppDispatch();
  const tokens = useSelector(showingSelling ? sellingTokensSelector : buyingTokensSelector);
  const theme = useTheme();
  const isBig = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    if (!tokens) {
      dispatch(workUnitsList());
    }
  }, [!!tokens]);

  if (!tokens) {
    return (
      <div className={styles.root}>
        <CircularProgress size={70} />
      </div>
    );
  }

  const tokensList = Object.values(tokens);

  const showWorkerCol = isBig && !showingSelling;

  return (
    <Paper className={styles.root}>
      <Tabs
        value={showingSelling ? 1 : 0}
        onChange={(_, val) => setShowingSelling(val === 1)}
        indicatorColor='primary'
        textColor='primary'
        variant='fullWidth'
      >
        <Tab label='Buying' />
        <Tab label='Selling' />
      </Tabs>
      <div className={styles.createCtr}>
        <Button variant='contained' color='primary' onClick={() => setCreateOpen(true)}>
          Sell / Create New Unit
        </Button>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableCell>
              Description
            </TableCell>
            {showWorkerCol && (
              <TableCell>Worker</TableCell>
            )}
            <TableCell>
              Status
            </TableCell>
            <TableCell></TableCell>
          </TableHead>
          <TableBody>
            {tokensList.map((v) => (
              <TableRow key={v.id}>
                <TableCell className={isBig ? styles.descCellBig : styles.descCellSmall}>
                  {`Unit #${v.id}: ${v.description}`}
                </TableCell>
                {showWorkerCol && (
                  <TableCell>
                    {v.seller}
                  </TableCell>
                )}
                <TableCell>
                  {v.saleStatus}
                </TableCell>
                <TableCell className={styles.actionCell}>
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {tokensList.length === 0 && (
        <Typography className={styles.emptyIndicator}>
          No work unit tokens to show.
        </Typography>
      )}
      <CreateWorkUnit open={createOpen} onClose={() => setCreateOpen(false)} />
    </Paper>
  );

}
