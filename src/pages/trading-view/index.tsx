import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
// eslint-disable-next-line import/no-unresolved
import CloseIcon from '@mui/icons-material/Close';
import { useHistory } from 'react-router';
import SwapContainer from '../swap/components/SwapContainer';
import SearchForPairingsComponent from '../swap/components/SearchForPairings';
import { useScreenSize } from '../../utils/screenSize';
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
    padding: '10px 0 0 0',
    height: '419.5px',
    gridArea: 'chart',
    border: '1px solid #0156FF',
    backgroundColor: '#253248',
    borderRadius: '8px',
  },
  tableBoxThree: {
    gridArea: 'swapContainer',
    display: 'flex',
    flexDirection: 'column',
  },
  swapTabs: {
    display: 'flex',
    justifyContent: 'center',
  },
  mobileSwapContent: {
    filter: 'blur(2px)',
  },
  chartMobile: {
    'top': '209px',
    'borderRadius': '16px',
    'width': '100%',
    'height': '400px',
    'alignItems': 'center',
    'backgroundColor': '#253248',
    'position': 'absolute',
    'marginBottom': '100px',
    'zIndex': 1,
    '::after': {
      filter: 'blur(10px)',
    },
  },
  buttonCloseWrapper: {
    margin: '10px',
    display: 'flex',
    justifyContent: 'end',
  },
  buttonClose: {
    cursor: 'pointer',
    border: 'none',
    color: '#0156FF',
  },
}));

const TradingView: React.FC = () => {
  const { isLaptop, isMobile } = useScreenSize();
  const styles = useStyles();
  const history = useHistory();
  const closeChartIfLaptopOrMobileSize = () => {
    history.push('/swap');
  };

  return (
    <>
      {!isMobile && !isLaptop ? (
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
      ) : (
        <>
          <div className={styles.mobileSwapContent}>
            <SearchForPairingsComponent type={'none'} width={'470px'} />
            <SwapContainer location={'trade'} />
          </div>
          <div className={styles.chartMobile}>
            <div className={styles.buttonCloseWrapper}>
              <CloseIcon
                className={styles.buttonClose}
                onClick={() => closeChartIfLaptopOrMobileSize()}
              />
            </div>
            <Chart />
          </div>
        </>
      )}
    </>
  );
};

export default TradingView;
