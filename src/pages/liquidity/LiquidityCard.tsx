import React, { useEffect, useState, useCallback } from 'react';
import {
  Liquidity,
  Percent,
  Token,
  LiquidityPoolKeysV4,
  LiquidityPoolInfo,
} from '@raydium-io/raydium-sdk';
import { Card, Typography, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import {
  useSwappableTokens,
  useSwapContext,
  useTokenMap,
  // eslint-disable-next-line import/no-unresolved
} from '@serum/swap-ui';

import {
  createToken,
  createTokenAmount,
  getAllRaydiumPoolKeys,
  getRaydiumPoolInfo,
  convertToBN,
} from '../../utils/raydiumRequests';
import { useConnection } from '../../srm-utils/connection';
import { sendTransaction } from '../../srm-utils/send';
import { getWalletTokenAccounts } from '../../srm-utils/getWalletTokenAccounts';
import { useWallet } from '../../components/wallet/wallet';
// import { InfoLabel } from '../swap/components/Info';
import { SwapFromForm, SwapToForm, SwitchButton } from '../swap/components/SwapCard';
import { PoolInfo } from './PoolInfo';
import { ConfirmationBlock } from './ConfirmationBlock';
import { InfoLabel } from './InfoLabel';
import { AddLiquidityButton } from './AddLiquidityButton';
import { ExpiresInBlock } from './ExpiresInBlock';
import { YourLiquidity } from './YourLiquidity';

const ADD_LIQUIDITY_TIMEOUT = 1000 * 60 * 2;

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    margin: '15px 0',
  },
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
  swapCard: {
    paddingTop: '52px',
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
  fromBlock: {
    position: 'relative',
    marginBottom: '8px',
  },
  createPoolText: {
    fontFamily: 'Saira !important',
    fontStyle: 'normal',
    fontWeight: '400 !important',
    fontSize: '16px !important',
    lineHeight: '29px !important',
    textAlign: 'left',
    color: '#FFFFFF',
  },
  wrapperCreatePoolButton: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'center',
  },
  createPoolButton: {
    'cursor': 'pointer',
    'width': '213px',
    'height': '43px',
    'fontSize': '20px',
    'fontFamily': '"Spy Agency", sans-serif',
    'fontWeight': '400',
    'color': '#fff',
    'border': 'solid 1px transparent',
    'borderRadius': '8px',
    'backgroundImage':
      // eslint-disable-next-line max-len
      'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, #EC26F5, #0156FF)',
    'backgroundOrigin': 'border-box',
    'backgroundClip': 'content-box, border-box',
    'boxShadow': '2px 50px rgb(3, 46, 131) inset',
    '&:hover': {
      background:
        // eslint-disable-next-line max-len
        'linear-gradient(257.52deg, #0156FF -5.37%, #9F5AE5 84.69%) padding-box, linear-gradient(257.52deg, #0156FF -5.37%, #9F5AE5 84.69%) border-box',
      boxShadow: '0px 0px 16px #9F5AE5',
    },
  },
}));

export default () => {
  const [poolKey, setPoolKey] = useState<LiquidityPoolKeysV4 | null>(null);
  const [poolInfo, setPoolInfo] = useState<LiquidityPoolInfo | null>(null);
  const [noWarnPools, setNoWarnPools] = useState<string[]>([]);
  const [isConfirmed, setConfirmed] = useState(false);
  const [isNotWarn, setNotWarn] = useState(false);
  const [isPoolExist, setPoolExist] = useState(false);
  const [loading, setLoading] = useState(false);
  const { swappableTokens: tokenList } = useSwappableTokens();
  const { fromMint, fromAmount, toMint, toAmount } = useSwapContext();
  const connection = useConnection();
  const { wallet } = useWallet();
  const tokenMap = useTokenMap();
  const styles = useStyles();

  const onLiquidityAdd = useCallback(async () => {
    if (wallet && poolKey && poolInfo && fromAmount && toAmount) {
      const { quoteMint, baseMint } = poolKey;
      const { baseDecimals, quoteDecimals } = poolInfo;
      const fromTokenInfo = tokenMap.get(baseMint.toString());
      const toTokenInfo = tokenMap.get(quoteMint.toString());

      const currencyAmount = createTokenAmount(
        createToken(
          baseMint.toString(),
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          baseDecimals,
          // @ts-ignore
          fromTokenInfo?.symbol,
          fromTokenInfo?.name,
        ),
        // @ts-ignore
        convertToBN(fromAmount * Math.pow(10, baseDecimals)),
      );
      const anotherCurrency = new Token(
        quoteMint.toString(),
        quoteDecimals,
        toTokenInfo?.symbol,
        toTokenInfo?.name,
      );
      const { maxAnotherAmount } = Liquidity.computeAnotherAmount({
        poolKeys: poolKey,
        poolInfo,
        amount: currencyAmount,
        anotherCurrency,
        slippage: new Percent(0),
      });
      const { rawInfos: tokenAccountRawInfos } = await getWalletTokenAccounts({
        connection,
        owner: wallet.publicKey,
      });

      if (tokenAccountRawInfos.length) {
        const { transaction, signers } = await Liquidity.makeAddLiquidityTransaction({
          connection,
          poolKeys: poolKey,
          userKeys: {
            tokenAccounts: tokenAccountRawInfos,
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
          timeout: ADD_LIQUIDITY_TIMEOUT,
        });

        if (isNotWarn) {
          setNoWarnPools([...noWarnPools, poolKey.id.toString()]);
        }
      }
    }
  }, [connection, wallet, poolKey, poolInfo, isNotWarn, noWarnPools, fromAmount, toAmount]);

  const fetchPoolInfo = useCallback(async () => {
    setLoading(true);
    const currentPoolInfo = await getRaydiumPoolInfo({
      connection,
      poolKeys: poolKey as LiquidityPoolKeysV4,
    });
    setPoolInfo(currentPoolInfo);
    setLoading(false);
  }, [connection, poolKey]);

  useEffect(() => {
    setLoading(true);
    getAllRaydiumPoolKeys(connection).then(poolKeys => {
      const [poolKey] = poolKeys.filter(
        pool =>
          (pool.baseMint.equals(fromMint) && pool.quoteMint.equals(toMint)) ||
          (pool.baseMint.equals(toMint) && pool.quoteMint.equals(fromMint)),
      );
      if (poolKey) {
        setPoolKey(poolKey);
        setPoolExist(true);
      } else {
        setPoolExist(false);
      }
      setLoading(false);
    });
  }, [fromMint, toMint, connection]);

  useEffect(() => {
    if (poolKey) {
      fetchPoolInfo();
    }
  }, [poolKey]);

  useEffect(() => {
    const noWarnPools = localStorage.getItem('noWarnPools');
    if (noWarnPools) {
      setNoWarnPools(JSON.parse(noWarnPools));
    }
  }, []);

  return (
    <Box className={styles.root}>
      <Card className={styles.card}>
        <div className={styles.fromBlock}>
          <Typography className={styles.title}>From</Typography>
          <ExpiresInBlock fetchStats={fetchPoolInfo} />
        </div>
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
        {isPoolExist && <PoolInfo poolInfo={poolInfo} />}
        {!(poolKey && noWarnPools.includes(poolKey.id.toString())) ? (
          <ConfirmationBlock
            isConfirmed={isConfirmed}
            setConfirmed={setConfirmed}
            isNotWarn={isNotWarn}
            setNotWarn={setNotWarn}
          />
        ) : null}
        <AddLiquidityButton
          disabled={!isConfirmed || !isPoolExist || !fromAmount || !toAmount}
          onClick={onLiquidityAdd}
          title={isPoolExist ? 'Add Liquidity' : 'Pool not found'}
          loading={loading}
        />
      </Card>
      <YourLiquidity poolInfo={poolInfo} />
      {/* <div>
        <h2 className={styles.cardLabel}>Create Pool</h2>
        <Card className={styles.card}>
          <Typography className={styles.createPoolText}>
            {`Create a liquidity pool on Bancambios that can be traded on the swap interface. Read
            the guide before attempting.`}
          </Typography>
          <div className={styles.wrapperCreatePoolButton}>
            <button className={styles.createPoolButton}>
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}
              >
                <AddTwoToneIcon sx={{ fontSize: 17 }} />
                Create Pool
              </div>
            </button>
          </div>
        </Card>
      </div> */}
    </Box>
  );
};
