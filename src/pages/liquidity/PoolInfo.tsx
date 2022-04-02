/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { TokenAmount } from '@raydium-io/raydium-sdk';
import { makeStyles } from '@mui/styles';
import { Box, Typography } from '@mui/material';

interface PoolInfoProps {
  baseCoinInfo: TokenAmount;
  quoteCoinInfo: TokenAmount;
  lpPoolAmount: string;
}

// @ts-ignore
const useStyles = makeStyles(theme => ({
  swapInfoWrapper: {
    'width': '100%',
    'height': 'fit-content',
    'position': 'relative',
    'display': 'flex',
    'flexDirection': 'row',
    'justifyContent': 'space-between',
    'backgroundColor': 'rgba(65, 63, 63, 1)',
    'borderRadius': '20px',
    'padding': '8px 16px',
    'marginBottom': '20px',
    'backgroundClip': 'padding-box',
    'border': 'solid 0.5px transparent',

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
      background: 'linear-gradient(266.03deg, #0156FF 6.58%, #EC26F5 98.25%)',
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

const normalizeAmount = (amount: string) =>
  Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const PoolInfo: React.FC<PoolInfoProps | Record<string, never>> = ({
  baseCoinInfo,
  quoteCoinInfo,
  lpPoolAmount,
}) => {
  const styles = useStyles();

  if (!baseCoinInfo || !quoteCoinInfo || !lpPoolAmount) {
    return null;
  }

  return (
    <Box className={styles.swapInfoWrapper}>
      <Box className={styles.swapInfoSideBlock}>
        <Box className={styles.swapInfoLeftSide}>
          <Typography className={styles.swapInfoText}>Pooled (base)</Typography>
        </Box>
        <Box className={styles.swapInfoLeftSide}>
          <Typography className={styles.swapInfoText}>Pooled (quote)</Typography>
        </Box>
        <Box className={styles.swapInfoLeftSide}>
          <Typography className={styles.swapInfoText}>LP supply</Typography>
        </Box>
      </Box>
      <Box className={styles.swapInfoSideBlock}>
        <Typography className={styles.swapInfoText}>
          {baseCoinInfo && normalizeAmount(baseCoinInfo.toFixed(2))} {baseCoinInfo.currency.symbol}
        </Typography>
        <Typography className={styles.swapInfoText}>
          {normalizeAmount(quoteCoinInfo.toFixed(2))} {quoteCoinInfo.currency.symbol}
        </Typography>
        <Typography className={styles.swapInfoText}>{normalizeAmount(lpPoolAmount)} LP</Typography>
      </Box>
    </Box>
  );
};
