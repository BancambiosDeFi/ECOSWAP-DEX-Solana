import { Token, LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import { PublicKey } from '@solana/web3.js';
import { TokenInfo } from '@solana/spl-token-registry';
import BN from 'bn.js';

import { createToken } from '../utils/raydiumRequests';

export interface ITokenAccount {
  publicKey?: PublicKey;
  mint?: PublicKey;
  isAssociated?: boolean;
  amount: BN;
  isNative: boolean;
}

export function shakeUndefindedItem<T>(arr: T[]): NonNullable<T>[] {
  return arr.filter(item => item !== null) as NonNullable<T>[];
}

export default function listToMap<T, S extends string, V = T>(
  source: T[],
  getKey: (item: T, index: number) => S,
  getValue?: (item: T, index: number) => V,
): Record<S, V> {
  // @ts-expect-error force
  return Object.fromEntries(
    source.map((item, idx) => [getKey(item, idx), getValue ? getValue(item, idx) : item]),
  );
}

export const getLpTokens = (tokenPairs: LiquidityPoolKeysV4[], tokenMap: Map<string, TokenInfo>) =>
  listToMap(
    shakeUndefindedItem<Token | undefined>(
      tokenPairs.map(pair => {
        const baseTokenInfo = tokenMap.get(pair.baseMint.toString());
        const quoteTokenInfo = tokenMap.get(pair.quoteMint.toString());
        if (!baseTokenInfo || !quoteTokenInfo) return; // NOTE :  no unknown base/quote lpToken
        const lpToken = createToken(
          pair.lpMint,
          baseTokenInfo.decimals,
          `${baseTokenInfo.symbol}-${quoteTokenInfo.symbol}`,
          `${baseTokenInfo.symbol}-${quoteTokenInfo.symbol} LP`,
        );

        return lpToken as Token;
      }),
    ),
    (t: Token) => t?.mint.toString(),
  );
