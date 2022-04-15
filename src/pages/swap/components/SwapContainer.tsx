import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { Box } from '@mui/material';
// eslint-disable-next-line import/no-unresolved
import { useSwapContext } from '@serum/swap-ui';
import { SwapType } from '../../../types';
import { useWallet } from '../../../components/wallet/wallet';
import { PagesTransitionButton } from '../../../components/PagesTransitionButton';
import { StakingTabs } from '../../../components/StakingTabs';
import SearchForPairingsComponent from './SearchForPairings';
import SwapCard from './SwapCard';
import { ChartContainer } from './ChartContainer';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    margin: '20px 33px 20px 0',
  },
  charts: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

interface ChartProps {
  location: string;
}

const SwapContainer: React.FC<ChartProps> = ({ location }) => {
  const styles = useStyles();
  const { fromMint, toMint } = useSwapContext();
  const { connected } = useWallet();

  return (
    <>
      <StakingTabs />
      <SearchForPairingsComponent type={'none'} width={'600'} />
      {connected ? (
        <>
          <Box className={styles.root}>
            <PagesTransitionButton location={location} />
            <SwapCard />
          </Box>
          <div className={styles.charts}>
            <ChartContainer mint={fromMint} swapType={SwapType.from} location={location} />
            <ChartContainer mint={toMint} swapType={SwapType.to} location={location} />
          </div>
        </>
      ) : (
        <Box className={styles.root}>
          <PagesTransitionButton location={location} />
          <SwapCard />
        </Box>
      )}
    </>
  );
};

export default SwapContainer;
