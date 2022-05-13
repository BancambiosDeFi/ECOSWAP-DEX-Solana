import { useCallback, useEffect, useState } from 'react';
import {
  Liquidity,
  LiquidityPoolInfo,
  LiquidityPoolKeysV4,
  Percent,
  Token,
} from '@raydium-io/raydium-sdk';
import { Box, Card, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useSwapContext, useSwappableTokens, useTokenMap } from '@serum/swap-ui';

import {
  convertToBN,
  createToken,
  createTokenAmount,
  getAllRaydiumPoolKeys,
  getRaydiumPoolInfo,
} from '../../utils/raydiumRequests';
import { useConnection } from '../../srm-utils/connection';
import { sendTransaction } from '../../srm-utils/send';
import { getWalletTokenAccounts } from '../../srm-utils/getWalletTokenAccounts';
import { useWallet } from '../../components/wallet/wallet';
// import { InfoLabel } from '../swap/components/Info';
import { SwapFromForm, SwapToForm, SwitchButton } from '../swap/components/SwapCard';
import { PoolInfo } from './PoolInfo';
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
  card: {
    border: '1px solid #0156FF',
    boxShadow: '0px 0px 30px 5px rgba(0,0,0,0.075)',
    backgroundColor: '#0A0C0E !important',
    width: '468px',
    height: 'fit-content',
    padding: '26px 16px 10px 16px',
    '@media(max-width: 540px)': {
      width: '100%',
    },
  },
  swapCard: {
    paddingTop: '52px',
  },
  title: {
    'fontFamily': 'Saira',
    'fontSize': '24px',
    'fontStyle': 'normal',
    'fontWeight': '400',
    'lineHeight': '34px',
    'letterSpacing': '0em',
    'textAlign': 'left',
    'color': '#FFFFFF',
    'marginBottom': '0px',
    '@media(max-width: 540px)': {
      fontSize: '16px',
    },
  },
  switchBlock: {
    'position': 'relative',
    'display': 'flex',
    'justifyContent': 'start',
    'alignItems': 'flex-end',
    'margin': '0',
    '@media(max-width: 540px)': {
      flexDirection: 'column-reverse',
      alignItems: 'normal',
    },
  },
  switchButtonContainer: {
    'marginLeft': '40px',
    'display': 'flex',
    'justifyContent': 'center',
    'alignItems': 'center',
    'margin': '10px 0',
    '@media(max-width: 540px)': {
      marginLeft: '0',
    },
  },
  switchTitle: {
    'left': 0,
    'bottom': 0,
    'fontFamily': 'Saira',
    'fontSize': '24px',
    'fontStyle': 'normal',
    'fontWeight': '400 ',
    'lineHeight': '34px ',
    'letterSpacing': '0em',
    'textAlign': 'left',
    'color': '#FFFFFF',
    'marginBottom': '0px',
    '@media(max-width: 540px)': {
      fontSize: '16px',
    },
  },
  infoHeaderBlock: {
    display: 'flex',
    flexDirection: 'row',
  },
  fromBlock: {
    position: 'relative',
  },
}));

export default () => {
  const [poolKeys, setPoolKeys] = useState<LiquidityPoolKeysV4[]>([]);
  const [poolKey, setPoolKey] = useState<LiquidityPoolKeysV4 | null>(null);
  const [poolInfo, setPoolInfo] = useState<LiquidityPoolInfo | null>(null);
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
          sentMessage: 'Add Liquidity Transaction Sent',
          successMessage: 'Transaction has been confirmed',
        });
      }
    }
  }, [connection, wallet, poolKey, poolInfo, fromAmount, toAmount]);

  const fetchPoolInfo = useCallback(async () => {
    setLoading(true);
    try {
      const currentPoolInfo = await getRaydiumPoolInfo({
        connection,
        poolKeys: poolKey as LiquidityPoolKeysV4,
      });
      setPoolInfo(currentPoolInfo);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [connection, poolKey]);

  useEffect(() => {
    setLoading(true);
    getAllRaydiumPoolKeys(connection).then(poolKeys => {
      const [poolKey] = poolKeys.filter(
        pool =>
          (pool.baseMint.equals(fromMint) && pool.quoteMint.equals(toMint)) ||
          (pool.baseMint.equals(toMint) && pool.quoteMint.equals(fromMint)),
      );
      setPoolKeys(poolKeys);
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

  return (
    <Box className={styles.root}>
      <Card sx={{ borderRadius: '8px' }} className={styles.card}>
        <div className={styles.fromBlock}>
          <Typography variant="inherit" className={styles.title}>
            From
          </Typography>
          <ExpiresInBlock fetchStats={fetchPoolInfo} />
        </div>
        <SwapFromForm tokenList={tokenList} />
        <div className={styles.switchBlock}>
          <Typography variant="inherit" className={styles.switchTitle}>
            To (Estimate)
          </Typography>
          <div className={styles.switchButtonContainer}>
            <SwitchButton />
          </div>
        </div>
        <SwapToForm style={{ marginBottom: '15px' }} tokenList={tokenList} />
        {isPoolExist && (
          <Box className={styles.infoHeaderBlock}>
            <InfoLabel />
          </Box>
        )}
        {isPoolExist && <PoolInfo poolInfo={poolInfo} />}
        <AddLiquidityButton
          disabled={!isPoolExist || !fromAmount || !toAmount}
          onClick={onLiquidityAdd}
          title={isPoolExist ? 'Add Liquidity' : 'Pool not found'}
          loading={loading}
        />
      </Card>
      <YourLiquidity poolKeys={poolKeys} />
    </Box>
  );
};
