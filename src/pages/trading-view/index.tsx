import React from 'react';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
// eslint-disable-next-line import/no-unresolved
import SwapContainer from '../swap/components/SwapContainer';
import { useWallet } from '../../components/wallet/wallet';
import SearchForPairingsComponent from '../swap/components/SearchForPairings';
import { Chart } from './Chart';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minHeight: '70vh',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  tableBoxContainer: {
    display: 'grid',
    gridGap: '10px',
    gridTemplateAreas: `'searchInput searchInput'
    'chart swapContainer'`,
  },
  tableBoxOne: {
    gridArea: 'searchInput',
    justifySelf: 'center',
  },
  tableBoxTwo: {
    marginTop: '15px',
    height: '340px',
    gridArea: 'chart',
  },
  tableBoxThree: {
    gridArea: 'swapContainer',
    display: 'flex',
    flexDirection: 'column'
  },
  swapTabs: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

const TradingView: React.FC = () => {
  const styles = useStyles();
  const { connected } = useWallet();

  return (
    <div className={styles.tableBoxContainer}>
      <div className={styles.tableBoxOne}>
        <SearchForPairingsComponent type={'none'} width={'470px'} />
      </div>
      <div className={styles.tableBoxTwo}>
        <Chart />
      </div>
      <div className={styles.tableBoxThree}>
        <SwapContainer location={'trade'} />
      </div>
    </div>
  );
};

export default TradingView;
