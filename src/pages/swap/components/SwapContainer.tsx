import React from 'react';
import { ChartContainer } from './ChartContainer';
import SwapCard from './SwapCard';
import { useSwapContext } from '@serum/swap-ui';
import { SwapType } from '../../../types';

const SwapContainer: React.FC = () => {
  const { fromMint, toMint } = useSwapContext();

  return (
    <>
      <ChartContainer mint={fromMint} swapType={SwapType.from} />
      <SwapCard />
      <ChartContainer mint={toMint} swapType={SwapType.to} />
    </>
  );
};

export default SwapContainer;
