import React from 'react';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
// eslint-disable-next-line import/no-unresolved
import SwapContainer from '../swap/components/SwapContainer';
import { useWallet } from '../../components/wallet/wallet';
import { Chart } from './Chart';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minHeight: '70vh',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  tableBoxContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    alignItems: 'center',
  },
  tableBoxOne: {
    height: '340px',
  },
  tableBoxOneConnected: {
    height: '520px',
  },
  tableBoxTwo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
  },
  swapTabs: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

export const ChartContainer = () => {
  const styles = useStyles();
  const { connected } = useWallet();

  return (
    <div className={styles.tableBoxContainer}>
      <div className={!connected ? styles.tableBoxOne : styles.tableBoxOneConnected}>
        <Chart />
      </div>
      <div className={styles.tableBoxTwo}>
        <SwapContainer location={'trade'} />
      </div>
    </div>
  );
};
