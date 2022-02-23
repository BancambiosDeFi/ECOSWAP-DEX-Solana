import {
  Liquidity,
  LiquidityPoolInfo,
  LiquidityPoolKeysV4,
  LiquidityFetchInfoParams,
  LiquidityComputeAmountOutParams,
  TokenAmount,
  Token,
  PublicKeyish,
  BigNumberish,
  Percent,
} from '@raydium-io/raydium-sdk';
import { Connection } from '@solana/web3.js';
import BN from 'bn.js';

export const getAllRaydiumPoolKeys = async (
  connection: Connection,
): Promise<LiquidityPoolKeysV4[]> => {
  return await Liquidity.fetchAllPoolKeys(connection);
};

export const getRaydiumAllPoolKeysFetcher = (connection: Connection, maxAttempts = 0) => {
  let attempt = 0;

  return async function fetchPoolKeys(): Promise<LiquidityPoolKeysV4[]> {
    return Liquidity.fetchAllPoolKeys(connection)
      .then(result => result)
      .catch(() => {
        if (attempt === maxAttempts) {
          // TODO: add notification about error
          throw new Error('Can not fetch pool keys from Raydium at the time');
        }
        attempt += 1;

        return fetchPoolKeys();
      });
  };
};

export const getRaydiumPoolInfo = async ({
  connection,
  poolKeys,
}: LiquidityFetchInfoParams): Promise<LiquidityPoolInfo> => {
  return await Liquidity.fetchInfo({ connection, poolKeys });
};

export const convertToBN = (number: number | string | number[] | Uint8Array | Buffer | BN): BN => {
  return new BN(number);
};

export const convertToPercent = (numerator: BigNumberish, denominator?: BigNumberish): Percent => {
  return new Percent(numerator, denominator);
};

export const createToken = (
  mint: PublicKeyish,
  decimals: number,
  symbol?: string,
  name?: string,
): Token => {
  return new Token(mint, decimals, symbol, name);
};

export const createTokenAmount = (token: Token, amount: BigNumberish): TokenAmount => {
  return new TokenAmount(token, amount);
};

export const getPriceImpact = ({
  poolKeys,
  poolInfo,
  amountIn,
  currencyOut,
  slippage,
}: LiquidityComputeAmountOutParams): string => {
  return Liquidity.computeAmountOut({
    poolKeys,
    poolInfo,
    amountIn,
    currencyOut,
    slippage,
  })
    .priceImpact.toFixed()
    .toString();
};
