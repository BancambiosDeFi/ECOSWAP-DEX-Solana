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
import { NotifyingProvider } from './NotifyingProvider';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minHeight: '70vh',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

export default function SwapPage({ children }) {
  const styles = useStyles();
  const [tokenList, setTokenList] = useState<TokenListContainer | null>(null);

  const [provider] = useMemo(() => {
    const opts: ConfirmOptions = {
      preflightCommitment: 'recent',
      commitment: 'recent',
    };
    const network = 'https://solana-api.projectserum.com';
    const wallet = new Wallet('https://www.sollet.io', network);
    const connection = new Connection(network, opts.preflightCommitment);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const provider = new NotifyingProvider(connection, wallet, opts, (tx, err) => {
      if (err) {
        console.log(err);
      }
    });

    return [provider, wallet];
  }, []);

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
        {tokenList && (
          <SwapProvider provider={provider} tokenList={tokenList as any}>
            {children}
          </SwapProvider>
        )}
      </Grid>
    </BasicLayout>
  );
}
