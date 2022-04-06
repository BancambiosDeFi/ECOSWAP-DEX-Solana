import React from 'react';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
// eslint-disable-next-line import/no-unresolved
import SwapContainer from '../swap/components/SwapContainer';
import { Chart } from './Chart';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minHeight: '70vh',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  tableBoxContainer: {
    verticalAlign: 'top',
    display: 'flex',
    alignItems: 'center',
  },
  tableBoxOne: {
    width: '100%',
    height: '100%',
    margin: 'auto 0 20px',
    // backgroundColor: 'white',
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

  return (
    <div className={styles.tableBoxContainer}>
      <div className={styles.tableBoxOne}>
        <Chart />
      </div>
      <div className={styles.tableBoxTwo}>
        <SwapContainer location={'trade'} />
      </div>
    </div>
  );
};
