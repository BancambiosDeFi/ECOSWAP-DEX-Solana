import React, { useState, useEffect, useContext } from 'react';

import { useTokenMap } from '@serum/swap-ui';
import { getAllRaydiumPoolKeys } from '../../utils/raydiumRequests';
import { useConnection } from '../../srm-utils/connection';

const REQUIRED_PAIRS_QTY = 120;

interface TokenPair {
  from: {
    symbol: string;
    address: string;
  };
  fromImg?: string;
  to: {
    symbol: string;
    address: string;
  };
  toImg?: string;
}

export type ContentContext = {
  pairs: TokenPair[];
};
const _ContentContext = React.createContext<null | ContentContext>(null);

export function ContentContextProvider(props: any) {
  const [pairs, setPairs] = useState<TokenPair[]>([]);
  const connection = useConnection();
  const tokenMap = useTokenMap();

  useEffect(() => {
    getAllRaydiumPoolKeys(connection).then(poolKeys => {
      const requiredQtyOfPoolKeys = poolKeys.slice(0, REQUIRED_PAIRS_QTY);
      const mappedPairs = requiredQtyOfPoolKeys
        .reduce((swapPairs: TokenPair[], poolKey) => {
          const fromToken = tokenMap.get(poolKey.baseMint.toString());
          const toToken = tokenMap.get(poolKey.quoteMint.toString());
          if (fromToken && toToken) {
            swapPairs.push({
              from: {
                symbol: fromToken?.symbol,
                address: fromToken?.address,
              },
              fromImg: fromToken?.logoURI,
              to: {
                symbol: toToken?.symbol,
                address: toToken?.address,
              },
              toImg: toToken?.logoURI,
            });
          }

          return swapPairs;
        }, [])
        .filter(pair => pair.fromImg && pair.toImg);
      setPairs(mappedPairs);
    });
  }, []);

  return (
    <_ContentContext.Provider
      value={{
        pairs,
      }}
    >
      {props.children}
    </_ContentContext.Provider>
  );
}

export function useContentContext(): ContentContext {
  const ctx = useContext(_ContentContext);
  if (ctx === null) {
    throw new Error('Context not available');
  }

  return ctx;
}
