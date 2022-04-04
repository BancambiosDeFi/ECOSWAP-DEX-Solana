import React, { useState, useEffect, useMemo } from 'react';
import { Grid } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Wallet from '@project-serum/sol-wallet-adapter';
import { ConfirmOptions, Connection } from '@solana/web3.js';
import { TokenListContainer, TokenListProvider } from '@solana/spl-token-registry';
// eslint-disable-next-line import/no-unresolved
import SwapProvider from '@serum/swap-ui';
import BasicLayout from '../../srm-components/BasicLayout';
import { NotifyingProvider } from '../swap/NotifyingProvider';
import SwapContainer from '../swap/components/SwapContainer';
import SearchForPairingsComponent from '../swap/components/SearchForPairings';
import SwapTabs from '../swap/components/SwapTabs';
import { Chart } from './Chart';
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minHeight: '70vh',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  tableBoxContainer: {
    verticalAlign: 'top',
    display: 'flex',
    alignItems: 'center',
  },
  tableBoxOne: {
    width: '100%',
    height: '264px',
    // backgroundColor: 'white',
  },
  tableBoxTwo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
  },
  swapTabs: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default function App() {
  const styles = useStyles();
  //   const { enqueueSnackbar } = useSnackbar();
  // const [isConnected, setIsConnected] = useState(false);
  const [tokenList, setTokenList] = useState<TokenListContainer | null>(null);

  const [provider, wallet] = useMemo(() => {
    const opts: ConfirmOptions = {
      preflightCommitment: 'recent',
      commitment: 'recent',
    };
    const network = 'https://solana-api.projectserum.com';
    const wallet = new Wallet('https://www.sollet.io', network);
    const connection = new Connection(network, opts.preflightCommitment);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const provider = new NotifyingProvider(connection, wallet, opts, () => {});

    return [provider, wallet];
  }, []);

  useEffect(() => {
    new TokenListProvider().resolve().then(setTokenList);
  }, [setTokenList]);

  // Connect to the wallet.
  useEffect(() => {
    wallet.on('connect', () => {
      //   enqueueSnackbar('Wallet connected', { variant: 'success' });
      // setIsConnected(true);
    });
    wallet.on('disconnect', () => {
      //   enqueueSnackbar('Wallet disconnected', { variant: 'info' });
      // setIsConnected(false);
    });
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
        {tokenList && (
          <SwapProvider provider={provider} tokenList={tokenList as any}>
            <div className={styles.tableBoxContainer}>
              <div className={styles.tableBoxOne}>
                <Chart />
              </div>
              <div className={styles.tableBoxTwo}>
                <div className={styles.swapTabs}>
                  <SwapTabs />
                </div>
                <SearchForPairingsComponent type={'none'} width={'100%'} />
                <SwapContainer location={'trade'} />
              </div>
            </div>
          </SwapProvider>
        )}
      </Grid>
    </BasicLayout>
  );
}
