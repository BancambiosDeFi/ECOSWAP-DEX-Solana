import { useState, useEffect, useMemo } from 'react';
import { LiquidityPoolKeysV4, LiquidityPoolInfo, TokenAmount } from '@raydium-io/raydium-sdk';
import { makeStyles } from '@mui/styles';
import { Box, Typography, Card } from '@mui/material';

import {
  useSwapContext,
  useMint,
  useTokenMap,
  // eslint-disable-next-line import/no-unresolved
} from '@serum/swap-ui';
import { useWallet } from '../../components/wallet/wallet';
import { WalletAdapter } from '../../components/wallet/types';
import { useConnection } from '../../srm-utils/connection';
import { getLpTokens, ITokenAccount } from '../../srm-utils/balance';
import { getWalletTokenAccounts } from '../../srm-utils/getWalletTokenAccounts';
import { notify } from '../../srm-utils/notifications';
import { createToken, createTokenAmount } from '../../utils/raydiumRequests';

import { PoolStats } from './PoolStats';

const useStyles = makeStyles(() => ({
  cardLabel: {
    fontFamily: 'Saira',
    fontWeight: '700',
    fontSize: '24px',
    margin: '0 0 15px 30px',
  },
  card: {
    borderRadius: '8px !important',
    border: '1px solid #0156FF',
    boxShadow: '0px 0px 30px 5px rgba(0,0,0,0.075)',
    backgroundColor: '#0A0C0E !important',
    width: '486px',
    height: 'fit-content',
    padding: '9px 25px',
    marginBottom: '43px',
  },
  infoText: {
    fontFamily: 'Saira !important',
    fontStyle: 'normal',
    fontWeight: '400 !important',
    fontSize: '16px !important',
    lineHeight: '29px !important',
    textAlign: 'left',
    color: '#FFFFFF',
  },
  tokensWrap: {
    display: 'flex',
    margin: '20px 0 15px',
  },
  logoWrap: {
    display: 'flex',
    position: 'relative',
    width: '60px',
    marginRight: '10px',
  },
  logo: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  logoFrom: {
    left: '10px',
    zIndex: '2',
    background: '#000',
    borderRadius: '50%',
  },
}));

interface PoolInfoProps {
  poolInfo: LiquidityPoolInfo | null;
  poolKey: LiquidityPoolKeysV4 | null;
  poolKeys: LiquidityPoolKeysV4[];
}

export const YourLiquidity = ({ poolInfo, poolKey, poolKeys }: PoolInfoProps) => {
  const [tokenAccounts, setTokenAccounts] = useState<ITokenAccount[]>([]);
  const connection = useConnection();
  const { fromMint, toMint } = useSwapContext();
  const tokenMap = useTokenMap();
  const toMintInfo = useMint(toMint);
  const fromMintInfo = useMint(fromMint);
  const { wallet, connected } = useWallet();
  const styles = useStyles();

  useEffect(() => {
    const fetchTokenAccountsFromWallet = async () => {
      try {
        const { accounts } = await getWalletTokenAccounts({
          connection,
          owner: (wallet as WalletAdapter).publicKey,
        });
        setTokenAccounts(accounts);
      } catch (error) {
        notify({
          type: 'error',
          message: 'Wallet Accounts could not be fetched',
          description: 'Wallet Accounts request error',
        });
      }
    };
    fetchTokenAccountsFromWallet();
  }, [connection, wallet?.publicKey]);

  const poolStats = useMemo(() => {
    if (poolInfo && poolKey && poolKeys.length) {
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

      let lpWalletAmount: TokenAmount | null = null;
      const lpTokens = getLpTokens(poolKeys, tokenMap);
      const lpToken = lpTokens[poolKey.lpMint.toString()];
      const lpWalletTokenAccount = tokenAccounts.find(
        ({ mint }) => mint && mint.toString() === poolKey.lpMint.toString(),
      );
      if (lpWalletTokenAccount) {
        lpWalletAmount = createTokenAmount(lpToken, lpWalletTokenAccount.amount);
      }

      return { baseCoinInfo, quoteCoinInfo, lpWalletAmount, lpSupply };
    }
  }, [poolInfo, poolKeys, toMint, toMintInfo, fromMint, fromMintInfo, tokenAccounts]);

  if (!poolStats || !connected || !poolKey) {
    return null;
  }

  const fromTokenInfo = tokenMap.get(poolKey.baseMint.toString());
  const toTokenInfo = tokenMap.get(poolKey.quoteMint.toString());

  return (
    <Box>
      <h2 className={styles.cardLabel}>Your Liquidity</h2>
      <Card className={styles.card}>
        <Box className={styles.tokensWrap}>
          <Box className={styles.logoWrap}>
            <img
              loading="lazy"
              width="30px"
              src={fromTokenInfo?.logoURI}
              alt=""
              className={`${styles.logo} ${styles.logoFrom}`}
            />
            <img
              loading="lazy"
              width="30px"
              src={toTokenInfo?.logoURI}
              alt=""
              className={styles.logo}
            />
          </Box>
          <Typography className={styles.infoText}>
            {poolStats.baseCoinInfo.currency.symbol} - {poolStats.quoteCoinInfo.currency.symbol}
          </Typography>
        </Box>
        <PoolStats poolStats={poolStats} />
        <Typography className={styles.infoText}>
          If you staked your LP tokens in a farm, unstake them to see them here
        </Typography>
      </Card>
    </Box>
  );
};
