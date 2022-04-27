/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo } from 'react';
import { LiquidityPoolInfo } from '@raydium-io/raydium-sdk';
import {
  useSwapContext,
  useMint,
  useTokenMap,
  // eslint-disable-next-line import/no-unresolved
} from '@serum/swap-ui';
import { createToken, createTokenAmount } from '../../utils/raydiumRequests';
import { PoolStats } from './PoolStats';

interface PoolInfoProps {
  poolInfo: LiquidityPoolInfo | null;
}

export const PoolInfo: React.FC<PoolInfoProps | Record<string, never>> = ({ poolInfo }) => {
  const { fromMint, toMint } = useSwapContext();
  const tokenMap = useTokenMap();
  const toMintInfo = useMint(toMint);
  const fromMintInfo = useMint(fromMint);

  const poolStats = useMemo(() => {
    if (poolInfo && toMintInfo && fromMintInfo) {
      const toTokenInfo = tokenMap.get(toMint.toString());
      const fromTokenInfo = tokenMap.get(fromMint.toString());

      const baseCoinInfo = createTokenAmount(
        createToken(
          fromMint.toString(),
          fromMintInfo?.decimals as number,
          fromTokenInfo?.symbol,
          fromTokenInfo?.name,
        ),
        poolInfo.baseReserve,
      );
      const quoteCoinInfo = createTokenAmount(
        createToken(
          toMint.toString(),
          toMintInfo?.decimals as number,
          toTokenInfo?.symbol,
          toTokenInfo?.name,
        ),
        poolInfo.quoteReserve,
      );
      const lpSupply = (poolInfo.lpSupply.toNumber() / 10 ** poolInfo.lpDecimals).toFixed(
        poolInfo.lpDecimals,
      );

      return { baseCoinInfo, quoteCoinInfo, lpSupply };
    }
  }, [poolInfo, toMint, toMintInfo, fromMint, fromMintInfo]);

  if (!poolStats) {
    return null;
  }

  return <PoolStats poolStats={poolStats} />;
};
