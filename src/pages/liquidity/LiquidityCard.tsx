import React, { useEffect, useState, useCallback } from 'react';
import {
  Liquidity,
  Spl,
  Percent,
  Token,
  LiquidityPoolKeysV4,
  LiquidityPoolInfo,
  SPL_ACCOUNT_LAYOUT,
  getMultipleAccountsInfo,
} from '@raydium-io/raydium-sdk';
import { Card, Typography, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  useSwappableTokens,
  useSwapContext,
  useMint,
  useTokenMap,
  // eslint-disable-next-line import/no-unresolved
} from '@serum/swap-ui';

import {
  createToken,
  createTokenAmount,
  getAllRaydiumPoolKeys,
  getRaydiumPoolInfo,
} from '../../utils/raydiumRequests';
import { useConnection } from '../../srm-utils/connection';
import { sendTransaction } from '../../srm-utils/send';
import { useWallet } from '../../components/wallet/wallet';
// import { InfoLabel } from '../swap/components/Info';
import { SwapFromForm, SwapToForm, SwitchButton } from '../swap/components/SwapCard';
import { PoolInfo } from './PoolInfo';
import { ConfirmationBlock } from './ConfirmationBlock';
import { InfoLabel } from './InfoLabel';
import { AddLiquidityButton } from './AddLiquidityButton';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    margin: '20px 0',
  },
  card: {
    borderRadius: '20px !important',
    border: '1px solid #0156FF',
    boxShadow: '0px 0px 30px 5px rgba(0,0,0,0.075)',
    backgroundColor: '#35363A !important',
    width: '435px',
    height: '100%',
    padding: '26px 16px',
  },
  title: {
    fontFamily: 'Saira !important',
    fontSize: '24px !important',
    fontStyle: 'normal',
    fontWeight: '400 !important',
    lineHeight: '34px !important',
    letterSpacing: '0em !important',
    textAlign: 'left',
    color: '#FFFFFF',
    marginBottom: '0px',
  },
  switchBlock: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '8px 0',
  },
  switchTitle: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    fontFamily: 'Saira !important',
    fontSize: '24px !important',
    fontStyle: 'normal',
    fontWeight: '400 !important',
    lineHeight: '34px !important',
    letterSpacing: '0em !important',
    textAlign: 'left',
    color: '#FFFFFF',
    marginBottom: '0px',
  },
  infoHeaderBlock: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

export default () => {
  const [raydiumPoolKeys, setRaydiumPoolKeys] = useState<LiquidityPoolKeysV4[]>([]);
  const [poolStats, setPoolStats] = useState({});
  const [poolKey, setPoolKey] = useState<LiquidityPoolKeysV4 | null>(null);
  const [poolInfo, setPoolInfo] = useState<LiquidityPoolInfo | null>(null);
  const [noWarnPools, setNoWarnPools] = useState<string[]>([]);
  const [isConfirmed, setConfirmed] = useState(false);
  const [isNotWarn, setNotWarn] = useState(false);
  const [isPoolExist, setPoolExist] = useState(false);
  const [loading, setLoading] = useState(false);
  const { swappableTokens: tokenList } = useSwappableTokens();
  const { fromMint, toMint, fromAmount, toAmount } = useSwapContext();
  const connection = useConnection();
  const { wallet } = useWallet();
  const tokenMap = useTokenMap();
  const toTokenInfo = tokenMap.get(toMint.toString());
  const fromTokenInfo = tokenMap.get(fromMint.toString());
  const toMintInfo = useMint(toMint);
  const fromMintInfo = useMint(fromMint);
  const styles = useStyles();

  const onLiquidityAdd = useCallback(async () => {
    if (wallet && poolKey && poolInfo) {
      const { quoteMint, baseMint } = poolKey;
      const { quoteDecimals } = poolInfo;

      const currencyAmount = createTokenAmount(
        createToken(
          fromMint.toString(),
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          fromMintInfo?.decimals,
          // @ts-ignore
          fromTokenInfo?.symbol,
          fromTokenInfo?.name,
        ),
        // @ts-ignore
        poolInfo.baseReserve,
      );
      const anotherCurrency = new Token(quoteMint, quoteDecimals);

      const { maxAnotherAmount } = Liquidity.computeAnotherAmount({
        poolKeys: poolKey,
        poolInfo,
        amount: currencyAmount,
        anotherCurrency,
        slippage: new Percent(0),
      });
      const quoteTokenAccount = await Spl.getAssociatedTokenAccount({
        mint: quoteMint,
        owner: wallet.publicKey,
      });
      const lpTokenAccount = await Spl.getAssociatedTokenAccount({
        mint: baseMint,
        owner: wallet.publicKey,
      });
      const infos = await getMultipleAccountsInfo(connection, [quoteTokenAccount, lpTokenAccount]);
      const [quoteAccountInfo, lpAccountInfo] = infos;
      if (quoteAccountInfo && lpAccountInfo) {
        const { transaction, signers } = await Liquidity.makeAddLiquidityTransaction({
          connection,
          poolKeys: poolKey,
          userKeys: {
            tokenAccounts: [
              {
                pubkey: quoteTokenAccount,
                accountInfo: SPL_ACCOUNT_LAYOUT.decode(quoteAccountInfo.data),
              },
              {
                pubkey: lpTokenAccount,
                accountInfo: SPL_ACCOUNT_LAYOUT.decode(lpAccountInfo.data),
              },
            ],
            owner: wallet.publicKey,
          },
          amountInA: currencyAmount,
          amountInB: maxAnotherAmount,
          fixedSide: 'a',
        });

        await sendTransaction({
          connection,
          wallet,
          transaction,
          signers,
        });

        if (isNotWarn) {
          setNoWarnPools([...noWarnPools, poolKey.id.toString()]);
        }
      }
    }
  }, [connection, wallet, poolKey, poolInfo, fromMintInfo, toMintInfo, isNotWarn, noWarnPools]);

  useEffect(() => {
    setLoading(true);
    getAllRaydiumPoolKeys(connection).then(poolKeys => {
      console.log('Pools added!');
      setRaydiumPoolKeys(poolKeys);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const fetchPoolInfo = async () => {
      const filteredPoolKeys = raydiumPoolKeys.filter(
        pool =>
          (pool.baseMint.equals(fromMint) && pool.quoteMint.equals(toMint)) ||
          (pool.baseMint.equals(toMint) && pool.quoteMint.equals(fromMint)),
      );

      if (filteredPoolKeys.length > 0) {
        setLoading(true);
        const poolInfo = await getRaydiumPoolInfo({ connection, poolKeys: filteredPoolKeys[0] });
        const baseCoinInfo = createTokenAmount(
          createToken(
            fromMint.toString(),
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            fromMintInfo?.decimals,
            // @ts-ignore
            fromTokenInfo?.symbol,
            fromTokenInfo?.name,
          ),
          // @ts-ignore
          poolInfo.baseReserve,
        );
        const quoteCoinInfo = createTokenAmount(
          createToken(
            toMint.toString(),
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            toMintInfo?.decimals,
            // @ts-ignore
            toTokenInfo?.symbol,
            toTokenInfo?.name,
          ),
          // @ts-ignore
          poolInfo.quoteReserve,
        );
        const lpPoolAmount = Number(
          (poolInfo.lpSupply.toNumber() / 10 ** poolInfo.lpDecimals).toFixed(poolInfo.lpDecimals),
        );
        setPoolExist(true);
        setLoading(false);
        setPoolKey(filteredPoolKeys[0]);
        setPoolInfo(poolInfo);
        setPoolStats({ baseCoinInfo, quoteCoinInfo, lpPoolAmount });
        // .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      } else {
        setPoolExist(false);
        console.error(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          `Pool stats ERROR: "${fromTokenInfo?.symbol}-${toTokenInfo?.symbol}" or ` +
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            `"${toTokenInfo?.symbol}-${fromTokenInfo?.symbol}" Raydium liquidity pool doesn't exist!`,
        );
      }
    };
    if (toMint && raydiumPoolKeys.length && fromMintInfo && toMintInfo) {
      fetchPoolInfo();
    }
  }, [
    toAmount,
    toMint,
    raydiumPoolKeys,
    fromMintInfo,
    toMintInfo,
    connection,
    fromAmount,
    fromMint,
    fromTokenInfo,
    toTokenInfo,
  ]);

  useEffect(() => {
    const noWarnPools = localStorage.getItem('noWarnPools');
    if (noWarnPools) {
      setNoWarnPools(JSON.parse(noWarnPools));
    }
  }, []);

  return (
    <Box className={styles.root}>
      <Card className={styles.card}>
        <Typography className={styles.title}>From</Typography>
        <SwapFromForm tokenList={tokenList} />
        <div className={styles.switchBlock}>
          <Typography className={styles.switchTitle}>To (Estimate)</Typography>
          <SwitchButton />
        </div>
        <SwapToForm style={{ marginBottom: '32px' }} tokenList={tokenList} />
        {isPoolExist && (
          <Box className={styles.infoHeaderBlock}>
            <InfoLabel />
          </Box>
        )}
        {isPoolExist && <PoolInfo {...poolStats} />}
        {!(poolKey && noWarnPools.includes(poolKey.id.toString())) ? (
          <ConfirmationBlock
            isConfirmed={isConfirmed}
            setConfirmed={setConfirmed}
            isNotWarn={isNotWarn}
            setNotWarn={setNotWarn}
          />
        ) : null}
        <AddLiquidityButton
          disabled={!isConfirmed || !isPoolExist}
          onClick={onLiquidityAdd}
          title={isPoolExist ? 'Add Liquidity' : 'Pool not found'}
          loading={loading}
        />
      </Card>
    </Box>
  );
};
