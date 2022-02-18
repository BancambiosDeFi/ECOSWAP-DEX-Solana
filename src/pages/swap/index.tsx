import React, { useState, useEffect, useMemo } from 'react';
import { Grid } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Wallet from '@project-serum/sol-wallet-adapter';
import { ConfirmOptions, Connection } from '@solana/web3.js';
import { TokenListContainer, TokenListProvider } from '@solana/spl-token-registry';

import SwapProvider from '@serum/swap-ui';
import BasicLayout from '../../srm-components/BasicLayout';
import { ContentContextProvider } from './ContentContext';
import { NotifyingProvider } from './NotifyingProvider';
import SwapContainer from './components/SwapContainer';
import SearchForPairingsComponent from './components/SearchForPairings';

// App illustrating the use of the Swap component.
//
// One needs to just provide an Anchor `Provider` and a `TokenListContainer`
// to the `Swap` component, and then everything else is taken care of.
// function App() {
//   return (
// <SnackbarProvider maxSnack={5} autoHideDuration={8000}>
// <AppInner />
// </SnackbarProvider>
//   );
// }

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minHeight: '100vh',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

export default function SwapPage() {
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
    const provider = new NotifyingProvider(connection, wallet, opts, (tx, err) => {
      // if (err) {
      //   enqueueSnackbar(`Error: ${err.toString()}`, {
      //     variant: 'error',
      //   });
      // } else {
      //   enqueueSnackbar('Transaction sent', {
      //     variant: 'success',
      //     action: (
      //       <Button
      //         color="inherit"
      //         component="a"
      //         target="_blank"
      //         rel="noopener"
      //         href={`https://explorer.solana.com/tx/${tx}`}
      //       >
      //         View on Solana Explorer
      //       </Button>
      //     ),
      //   });
      // }
    });

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
            <ContentContextProvider>
              <>
                <SearchForPairingsComponent type={'none'} />
                <SwapContainer />
              </>
            </ContentContextProvider>
          </SwapProvider>
        )}
      </Grid>
    </BasicLayout>
  );
}
