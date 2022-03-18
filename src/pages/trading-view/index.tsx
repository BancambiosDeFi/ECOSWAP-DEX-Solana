import { createChart, CrosshairMode } from 'lightweight-charts';
import React, { useState, useRef, useEffect, useMemo } from 'react';
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
import { priceData } from './priceData';
import { volumeData } from './volumeData';

const ChartComponent = () => {
  const chartContainerRef = useRef() as any;
  const chart = useRef() as any;
  // const resizeObserver = useRef() as any;

  useEffect(() => {
    chart.current = createChart(chartContainerRef.current, {
      width: 580,
      height: 400,
      layout: {
        backgroundColor: '#253248',
        textColor: 'rgba(255, 255, 255, 0.9)',
      },
      grid: {
        vertLines: {
          color: '#334158',
        },
        horzLines: {
          color: '#334158',
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      timeScale: {
        borderColor: '#485c7b',
      },
    });

    console.log(chart.current);

    const candleSeries = chart.current.addCandlestickSeries({
      upColor: '#4bffb5',
      downColor: '#ff4976',
      borderDownColor: '#ff4976',
      borderUpColor: '#4bffb5',
      wickDownColor: '#838ca1',
      wickUpColor: '#838ca1',
    });

    candleSeries.setData(priceData);

    const volumeSeries = chart.current.addHistogramSeries({
      color: '#182233',
      lineWidth: 2,
      priceFormat: {
        type: 'volume',
      },
      overlay: true,
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    volumeSeries.setData(volumeData);
  }, []);

  // Resize chart on container resizes.
  useEffect(() => {
    // resizeObserver.current = new ResizeObserver(entries => {
    //   const { width, height } = entries[0].contentRect;
    //   chart.current.applyOptions({ width, height });
    //   setTimeout(() => {
    //     chart.current.timeScale().fitContent();
    //   }, 0);
    // });
    // resizeObserver.current.observe(chartContainerRef.current);
    // return () => resizeObserver.current.disconnect();
  }, []);

  return (
    <div>
      <div ref={chartContainerRef} className="chart-container" />
    </div>
  );
};

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
    justifyContent: 'center',
  },
  tableBoxOne: {
    display: 'inline-block',
    width: '54%',
    paddingRight: '10px',
    height: '300px',
    // backgroundColor: 'white',
    position: 'relative',
    top: '-20px',
  },
  tableBoxTwo: {
    display: 'inline-block',
    width: '50%',
    // backgroundColor: 'red',
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
                <ChartComponent></ChartComponent>
              </div>

              <div className={styles.tableBoxTwo}>
                <SearchForPairingsComponent type={'none'} width={'auto'} />
                <SwapContainer location={'trade'} />
              </div>
            </div>
          </SwapProvider>
        )}
      </Grid>
    </BasicLayout>
  );
}
