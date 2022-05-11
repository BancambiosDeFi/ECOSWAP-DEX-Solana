import { useMemo } from 'react';
import { Grid } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Wallet from '@project-serum/sol-wallet-adapter';
import { ConfirmOptions, Connection } from '@solana/web3.js';
import Swap from '@serum/swap-ui';
import BasicLayout from '../../srm-components/BasicLayout';
import { useWallet } from '../../components/wallet/wallet';
import { useRadium } from '../../utils/raydium';
import { NotifyingProvider } from './NotifyingProvider';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: '25px',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function SwapPage({ children }) {
  const styles = useStyles();
  const { wallet } = useWallet();
  const { tokenList } = useRadium();

  const [provider] = useMemo(() => {
    const opts: ConfirmOptions = {
      preflightCommitment: 'recent',
      commitment: 'recent',
    };
    const network = 'https://solana-api.projectserum.com';
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new NotifyingProvider(
      connection,
      wallet as Wallet,
      opts,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (tx, err) => undefined,
    );

    return [provider];
  }, [wallet]);

  // TODO: change tokenList any type to something meaningful
  return (
    <BasicLayout>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        className={styles.root}
      >
        {tokenList && wallet && (
          <Swap provider={provider} tokenList={tokenList as any}>
            {children}
          </Swap>
        )}
      </Grid>
    </BasicLayout>
  );
}
