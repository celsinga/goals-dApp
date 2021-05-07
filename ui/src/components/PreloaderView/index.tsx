import styles from './index.css';
import WarningIcon from '@material-ui/icons/Warning';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { NoProviderError, NoContractOnNetworkError } from '../../services/eth';

export default function PreloaderView({ error }: { error: Error | null }) {
  let errorMessage = '';
  if (!!error) {
    switch (error.name) {
      case NoProviderError.prototype.constructor.name:
        errorMessage = 'Could not access Ethereum provider. Ensure your wallet is installed and initialized.';
        break;
      case NoContractOnNetworkError.prototype.constructor.name:
        errorMessage = `Could not find contract on current network. Ensure you\'re connected to Goerli or a local test network.\n(${error.message})`
        break;
      default:
        errorMessage = `Unexpected error occurred: ${error.message}`;
    }
  }
  return (
    <div className={styles.root}>
      {!!errorMessage ? (
        <div className={styles.errorCtr}>
          <WarningIcon />
          <Typography
            color='textPrimary'
            variant='h6'
            style={{ whiteSpace: 'pre-line' }}
          >
            {errorMessage}
          </Typography>
        </div>
      ) : (
        <CircularProgress size={80} />
      )}
    </div>
  );
}
