import React from 'react';
import { ChartContainer } from './ChartContainer';
import SwapCard from './SwapCard';
import { useSwapContext } from '@serum/swap-ui';
import { SwapType } from '../../../types';
import { useWallet } from '../../../components/wallet/wallet';

const SwapContainer: React.FC = () => {
  const { fromMint, toMint } = useSwapContext();
  const { connected } = useWallet();

  return (
    <>
      {connected ? (
        <>
          <ChartContainer mint={fromMint} swapType={SwapType.from} />
          <SwapCard />
          <ChartContainer mint={toMint} swapType={SwapType.to} />
        </>
      ) : (
        <SwapCard />
      )}
    </>
  );
};

export default SwapContainer;
