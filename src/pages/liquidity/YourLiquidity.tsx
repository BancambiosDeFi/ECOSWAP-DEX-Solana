import { useState, useEffect, useMemo } from 'react';
import { LiquidityPoolKeysV4, LiquidityPoolInfo, TokenAmount } from '@raydium-io/raydium-sdk';
import { makeStyles } from '@mui/styles';
import { Box, Typography, Card } from '@mui/material';

import { useMint, useTokenMap } from '@serum/swap-ui';
import { useWallet } from '../../components/wallet/wallet';
import { WalletAdapter } from '../../components/wallet/types';
import { useConnection } from '../../srm-utils/connection';
import { getLpTokens, ITokenAccount } from '../../srm-utils/balance';
import { getWalletTokenAccounts } from '../../srm-utils/getWalletTokenAccounts';
import { notify } from '../../srm-utils/notifications';
import { createToken, createTokenAmount, getRaydiumPoolInfo } from '../../utils/raydiumRequests';

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
  poolKeys: LiquidityPoolKeysV4[];
}

export const YourLiquidity = ({ poolKeys }: PoolInfoProps) => {
  const [lpPoolKey, setPoolKey] = useState<LiquidityPoolKeysV4 | null>(null);
  const [lpPoolInfo, setPoolInfo] = useState<LiquidityPoolInfo | null>(null);
  const [tokenAccounts, setTokenAccounts] = useState<ITokenAccount[]>([]);
  const connection = useConnection();
  const tokenMap = useTokenMap();
  const toMintInfo = useMint(lpPoolKey?.baseMint);
  const fromMintInfo = useMint(lpPoolKey?.quoteMint);
  const { wallet, connected } = useWallet();
  const styles = useStyles();

  useEffect(() => {
    const fetchTokenAccountsFromWallet = async () => {
      try {
        const { accounts } = await getWalletTokenAccounts({
          connection,
          owner: (wallet as WalletAdapter).publicKey,
        });
        const lpPoolKey = poolKeys.find(({ lpMint }) =>
          accounts.find(({ mint }) => mint && mint.toString() === lpMint.toString()),
        );
        setTokenAccounts(accounts);
        setPoolKey(lpPoolKey || null);
      } catch (error) {
        notify({
          type: 'error',
          message: 'Wallet Accounts could not be fetched',
          description: 'Wallet Accounts request error',
        });
      }
    };
    fetchTokenAccountsFromWallet();
  }, [connection, wallet?.publicKey, poolKeys, tokenMap]);

  useEffect(() => {
    const fetchPoolInfo = async () => {
      try {
        const currentPoolInfo = await getRaydiumPoolInfo({
          connection,
          poolKeys: lpPoolKey as LiquidityPoolKeysV4,
        });
        setPoolInfo(currentPoolInfo);
      } catch (error) {
        console.log(error);
      }
    };
    if (lpPoolKey) {
      fetchPoolInfo();
    }
  }, [connection, lpPoolKey]);

  const poolStats = useMemo(() => {
    if (lpPoolInfo && lpPoolKey && poolKeys.length) {
      const toTokenInfo = tokenMap.get(lpPoolKey.quoteMint.toString());
      const fromTokenInfo = tokenMap.get(lpPoolKey.baseMint.toString());

      const baseCoinInfo = createTokenAmount(
        createToken(
          lpPoolKey.baseMint.toString(),
          fromMintInfo?.decimals as number,
          fromTokenInfo?.symbol,
          fromTokenInfo?.name,
        ),
        lpPoolInfo.baseReserve,
      );
      const quoteCoinInfo = createTokenAmount(
        createToken(
          lpPoolKey.quoteMint.toString(),
          toMintInfo?.decimals as number,
          toTokenInfo?.symbol,
          toTokenInfo?.name,
        ),
        lpPoolInfo.quoteReserve,
      );
      const lpSupply = (lpPoolInfo.lpSupply.toNumber() / 10 ** lpPoolInfo.lpDecimals).toFixed(
        lpPoolInfo.lpDecimals,
      );

      let lpWalletAmount: TokenAmount | null = null;
      const lpTokens = getLpTokens(poolKeys, tokenMap);
      const lpToken = lpTokens[lpPoolKey.lpMint.toString()];
      const lpWalletTokenAccount = tokenAccounts.find(
        ({ mint }) => mint && mint.toString() === lpPoolKey.lpMint.toString(),
      );
      if (lpWalletTokenAccount) {
        lpWalletAmount = createTokenAmount(lpToken, lpWalletTokenAccount.amount);
      }

      return { baseCoinInfo, quoteCoinInfo, lpWalletAmount, lpSupply };
    }
  }, [lpPoolInfo, lpPoolKey, poolKeys, toMintInfo, fromMintInfo, tokenAccounts]);

  if (!poolStats || !connected || !lpPoolKey) {
    return null;
  }

  const fromTokenInfo = tokenMap.get(lpPoolKey.baseMint.toString());
  const toTokenInfo = tokenMap.get(lpPoolKey.quoteMint.toString());

  return (
    <Box>
      <h2 className={styles.cardLabel}>Your Liquidity</h2>
      <Card className={styles.card}>
        {lpPoolKey && (
          <>
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
          </>
        )}
        <Typography className={styles.infoText}>
          If you staked your LP tokens in a farm, unstake them to see them here
        </Typography>
      </Card>
    </Box>
  );
};
