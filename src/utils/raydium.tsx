import React, { useContext, useEffect, useState } from 'react';
import { LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import { TokenListContainer, TokenListProvider } from '@solana/spl-token-registry';
import axios from 'axios';

interface RaydiumContextValues {
  raydiumPoolKeys: LiquidityPoolKeysV4[] | undefined;
  tokenList: TokenListContainer | undefined;
}

// eslint-disable-next-line max-len
const RaydiumContext: React.Context<null | RaydiumContextValues> = React.createContext<null | RaydiumContextValues>(
  null,
);

export const RaydiumProvider = ({ children }) => {
  const [raydiumPoolKeys, setRaydiumPoolKeys] = useState<LiquidityPoolKeysV4[] | undefined>(
    undefined,
  );
  const [tokenList, setTokenList] = useState<TokenListContainer | undefined>(undefined);

  useEffect(() => {
    (async function getRaydiumPools() {
      try {
        const res = await axios.get('https://sdk.raydium.io/liquidity/mainnet.json');
        const radiumPools = res.data.official.concat(res.data.unOfficial);

        setRaydiumPoolKeys(radiumPools);

        const mintSet = new Set();
        [...radiumPools].map(key => {
          mintSet.add(key.baseMint);
          mintSet.add(key.quoteMint);
        });

        const nonFilteredTokenList = await new TokenListProvider().resolve();

        const filteredTokenList = nonFilteredTokenList
          .getList()
          .filter(token => mintSet.has(token.address));

        setTokenList(new TokenListContainer(filteredTokenList));
      } catch (error) {
        console.error('Get Raydium pools error!', error);
      }
    })();
  }, []);

  return (
    <RaydiumContext.Provider value={{ raydiumPoolKeys, tokenList }}>
      {children}
    </RaydiumContext.Provider>
  );
};

export const useRadium = () => {
  const context = useContext(RaydiumContext);
  if (!context) throw new Error('Missing referrer context');

  return {
    raydiumPoolKeys: context.raydiumPoolKeys,
    tokenList: context.tokenList,
  };
};
