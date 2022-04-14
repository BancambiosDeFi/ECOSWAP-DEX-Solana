import React, { useState, useEffect, useMemo } from 'react';
import { Grid } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Wallet from '@project-serum/sol-wallet-adapter';
import { ConfirmOptions, Connection } from '@solana/web3.js';
import { TokenListContainer, TokenListProvider } from '@solana/spl-token-registry';

// eslint-disable-next-line import/no-unresolved
import Swap from '@serum/swap-ui';
import BasicLayout from '../../srm-components/BasicLayout';
import { useWallet } from '../../components/wallet/wallet';
import { NotifyingProvider } from './NotifyingProvider';
import SwapContainer from './components/SwapContainer';
import SearchForPairingsComponent from './components/SearchForPairings';
import SwapTabs from './components/SwapTabs';

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
    minHeight: '70vh',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

export default function SwapPage() {
  const styles = useStyles();
  const { wallet } = useWallet();
  //   const { enqueueSnackbar } = useSnackbar();
  // const [isConnected, setIsConnected] = useState(false);
  const [tokenList, setTokenList] = useState<TokenListContainer | null>(null);

  const [provider] = useMemo(() => {
    const opts: ConfirmOptions = {
      preflightCommitment: 'recent',
      commitment: 'recent',
    };
    const network = 'https://solana-api.projectserum.com';
    const connection = new Connection(network, opts.preflightCommitment);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const provider = new NotifyingProvider(connection, wallet as Wallet, opts, (tx, err) => {
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

    return [provider];
  }, [wallet]);

  useEffect(() => {
    new TokenListProvider().resolve().then(setTokenList);
  }, [setTokenList]);

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
            <>
              <SwapTabs />
              <SearchForPairingsComponent type={'none'} width={'600'} />
              <SwapContainer location={'swap'} />
            </>
          </Swap>
        )}
      </Grid>
    </BasicLayout>
  );
}
