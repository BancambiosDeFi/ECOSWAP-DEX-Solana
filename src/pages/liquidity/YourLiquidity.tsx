import React from 'react';
import { Card, Typography, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { PoolInfo } from './PoolInfo';

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
}));

export const YourLiquidity = ({ poolInfo }) => {
  const styles = useStyles();

  return (
    <Box>
      <h2 className={styles.cardLabel}>Your Liquidity</h2>
      <Card className={styles.card}>
        <PoolInfo poolInfo={poolInfo} />
        <Typography className={styles.infoText}>
          If you staked your LP tokens in a farm, unstake them to see them here
        </Typography>
      </Card>
    </Box>
  );
};
