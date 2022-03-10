import React from 'react';
import { ChartContainer } from './ChartContainer';
import SwapCard from './SwapCard';
import { useSwapContext } from '@serum/swap-ui';
import { SwapType } from '../../../types';
import { useWallet } from '../../../components/wallet/wallet';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { PagesTransitionButton } from '../../../components/PagesTransitionButton';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    margin: '20px 33px 20px 0',
  },
}));

const SwapContainer: React.FC = () => {
  const styles = useStyles();
  const { fromMint, toMint } = useSwapContext();
  const { connected } = useWallet();

  return (
    <>
      {connected ? (
        <>
          <ChartContainer mint={fromMint} swapType={SwapType.from} />
          <Box className={styles.root}>
            <PagesTransitionButton location={'swap'} />
            <SwapCard />
          </Box>
          <ChartContainer mint={toMint} swapType={SwapType.to} />
        </>
      ) : (
        <Box className={styles.root}>
          <PagesTransitionButton location={'swap'} />
          <SwapCard />
        </Box>
      )}
    </>
  );
};

export default SwapContainer;
