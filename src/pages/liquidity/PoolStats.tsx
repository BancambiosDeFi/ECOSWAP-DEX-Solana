import { makeStyles } from '@mui/styles';
import { Box, Typography } from '@mui/material';
import { TokenAmount } from '@raydium-io/raydium-sdk';

import { toFraction, toPercentString, toString } from '../../srm-utils/priceHelper';

const useStyles = makeStyles(() => ({
  swapInfoWrapper: {
    'width': '100%',
    'height': 'fit-content',
    'position': 'relative',
    'display': 'flex',
    'flexDirection': 'row',
    'justifyContent': 'space-between',
    'backgroundColor': '#1B2341',
    'padding': '8px 16px',
    'marginBottom': '20px',
    'border': 'solid 1px #0156FF',
    'borderRadius': '8px',
    '&:before': {
      content: '',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: '-1',
      margin: '-0.5px',
      borderRadius: '20px',
    },
    // border: '0.5px solid linear-gradient(266.03deg, #0156FF 6.58%, #EC26F5 98.25%)',
  },
  swapInfoSideBlock: {
    width: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  swapInfoLeftSide: {
    width: 'fit-content',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  swapInfoText: {
    fontFamily: 'Saira !important',
    fontStyle: 'normal',
    fontWeight: '400 !important',
    fontSize: '16px !important',
    lineHeight: '29px !important',
    textAlign: 'right',
    color: '#FFFFFF',
  },
}));

interface PoolStatsProps {
  poolStats: {
    baseCoinInfo: TokenAmount;
    quoteCoinInfo: TokenAmount;
    lpSupply: string;
    lpWalletAmount?: TokenAmount | null;
  };
}

export const PoolStats = ({ poolStats }: PoolStatsProps) => {
  const { baseCoinInfo, quoteCoinInfo, lpSupply, lpWalletAmount } = poolStats;
  const sharePercent = lpWalletAmount ? toFraction(lpWalletAmount).div(toFraction(lpSupply)) : null;
  const styles = useStyles();

  return (
    <Box className={styles.swapInfoWrapper}>
      <Box className={styles.swapInfoSideBlock}>
        <Box className={styles.swapInfoLeftSide}>
          <Typography className={styles.swapInfoText}>Pooled (base)</Typography>
        </Box>
        <Box className={styles.swapInfoLeftSide}>
          <Typography className={styles.swapInfoText}>Pooled (quote)</Typography>
        </Box>
        {!lpWalletAmount && (
          <Box className={styles.swapInfoLeftSide}>
            <Typography className={styles.swapInfoText}>LP supply</Typography>
          </Box>
        )}
        {lpWalletAmount && (
          <>
            <Box className={styles.swapInfoLeftSide}>
              <Typography className={styles.swapInfoText}>Your Pool Token</Typography>
            </Box>
            <Box className={styles.swapInfoLeftSide}>
              <Typography className={styles.swapInfoText}>Your Pool Share</Typography>
            </Box>
          </>
        )}
      </Box>
      <Box className={styles.swapInfoSideBlock}>
        <Typography className={styles.swapInfoText}>
          {baseCoinInfo && baseCoinInfo.token.decimals
            ? `${toString(baseCoinInfo || 0, { decimalLength: 2, separator: ',' })} ${
                baseCoinInfo.currency.symbol ?? ''
              }`
            : '--'}
        </Typography>
        <Typography className={styles.swapInfoText}>
          {quoteCoinInfo && quoteCoinInfo.token.decimals
            ? `${toString(quoteCoinInfo || 0, { decimalLength: 2, separator: ',' })} ${
                quoteCoinInfo.currency.symbol ?? ''
              }`
            : '--'}
        </Typography>
        {!lpWalletAmount && (
          <Typography className={styles.swapInfoText}>
            {lpSupply
              ? toString(lpSupply ?? 0, { decimalLength: 2, separator: ',' }) + ' LP'
              : '--'}
          </Typography>
        )}
        {lpWalletAmount && (
          <>
            <Typography className={styles.swapInfoText}>
              {lpWalletAmount ? toString(lpWalletAmount || 0, { separator: ',' }) : '--'}
            </Typography>
            <Typography className={styles.swapInfoText}>
              {sharePercent ? toPercentString(sharePercent || 0) : '--%'}
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
};
