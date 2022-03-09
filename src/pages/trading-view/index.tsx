import { createChart } from 'lightweight-charts';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Grid } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Wallet from '@project-serum/sol-wallet-adapter';
import { ConfirmOptions, Connection } from '@solana/web3.js';
import { TokenListContainer, TokenListProvider } from '@solana/spl-token-registry';

import SwapProvider from '@serum/swap-ui';
import BasicLayout from '../../srm-components/BasicLayout';
import { NotifyingProvider } from '../swap/NotifyingProvider';
import SwapContainer from '../swap/components/SwapContainer';
import SearchForPairingsComponent from '../swap/components/SearchForPairings';

const ChartComponent = props => {
  const chartContainerRef = useRef() as any;

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const { data } = props;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
    });
    chart.timeScale().fitContent();

    const newSeries = chart.addAreaSeries();
    newSeries.setData(data);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      chart.remove();
    };
  }, [props.data]);

  return <div ref={chartContainerRef} />;
};

const initialData = [
  { time: '2018-12-22', value: 32.51 },
  { time: '2018-12-23', value: 31.11 },
  { time: '2018-12-24', value: 27.02 },
  { time: '2018-12-25', value: 27.32 },
  { time: '2018-12-26', value: 25.17 },
  { time: '2018-12-27', value: 28.89 },
  { time: '2018-12-28', value: 25.46 },
  { time: '2018-12-29', value: 23.92 },
  { time: '2018-12-30', value: 22.68 },
  { time: '2018-12-31', value: 22.67 },
];

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minHeight: '100vh',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  tableBox: {
    display: 'inline-block',
    width: '50%',
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
            <div>
              <div className={styles.tableBox}>
                <ChartComponent data={initialData}></ChartComponent>
              </div>
              <div className={styles.tableBox}>
                <SearchForPairingsComponent type={'none'} />
                <SwapContainer />
              </div>
            </div>
          </SwapProvider>
        )}
      </Grid>
    </BasicLayout>
  );
}
