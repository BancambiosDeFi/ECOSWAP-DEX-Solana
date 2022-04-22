import { TokenAmount, Token, LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
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

export function objectMapEntry<T, V extends [string, any]>(
  target: T | undefined,
  // eslint-disable-next-line prettier/prettier
  mapper: (entry: [key: keyof T, value: T[keyof T]]) => V): { [P in keyof V[0]]: V[1] } {
  // @ts-expect-error
  return Object.fromEntries(
    Object.entries(target ?? {}).map(([key, value]) => {
      // @ts-expect-error
      return mapper([key, value]);
    }),
  );
}

export function objectMap<T, V>(
  target: T | undefined,
  callbackFn: (value: T[keyof T], key: keyof T) => V,
): Record<keyof T, V> {
  //@ts-expect-error why type error?
  return objectMapEntry(target, ([key, value]) => [key, callbackFn(value, key)]);
}

export function objectFilter<T, K extends string>(
  obj: Record<K, T> | undefined,
  callbackFn: (value: T, key: K) => boolean,
): Record<K, T> {
  //@ts-expect-error
  return Object.fromEntries(
    Object.entries(obj ?? {}).filter(([key, value]) => {
      //@ts-expect-error
      return callbackFn(value, key);
    }),
  );
}

export function objectShakeNil<T>(obj: T): { [K in keyof T]: NonNullable<T[K]> } {
  //@ts-expect-error force type
  return objectFilter(obj, value => value !== undefined && value !== null);
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

export function toPureBalance(tokenAccount: ITokenAccount, tokenMap: Record<string, Token>) {
  //   console.log(tokenAccount.mint.toString());

  if (!tokenAccount.mint) return undefined;

  const token = tokenMap[tokenAccount.mint.toString()];

  //   console.log(token);

  if (!token) return undefined;
  // console.log('tokenAccount: ', tokenAccount)

  return new TokenAmount(token, tokenAccount.amount);
}

export const getPureBalances = (tokenAccounts, tokenMap) =>
  objectShakeNil({
    ...listToMap(
      tokenAccounts,
      (tokenAccount: ITokenAccount) => String(tokenAccount.mint),
      (tokenAccount: ITokenAccount) => toPureBalance(tokenAccount, tokenMap),
    ),
  });

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
