import { useHistory, useLocation } from 'react-router';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { makeStyles } from '@mui/styles';

const ALLOWED_PATHES = ['/swap', '/liquidity'];

const useStyles = makeStyles(() => ({
  tabs: {
    'width': '283px',
    'background': '#1B2341',
    'borderRadius': '12px',
    'marginBottom': '15px',
    '@media(max-width: 540px)': {
      width: '203px',
    },
  },
  tab: {
    '&&': {
      'width': '50%',
      'textTransform': 'none',
      'color': '#BDC1C6',
      'fontSize': '24px',
      'fontWeight': '700',
      'fontFamily': 'Saira',
      'borderRadius': '8px',
      '@media(max-width: 540px)': {
        fontSize: '16px',
        width: '50%',
      },
    },
  },
  active: {
    '&&&': {
      width: '50%',
      color: '#fff',
      background: '#092667',
    },
  },
}));

export const StakingTabs = () => {
  //   const [value, setValue] = useState(getPrefixedPath(tab));
  const history = useHistory();
  const location = useLocation();
  const styles = useStyles();
  const path = location.pathname;

  if (!ALLOWED_PATHES.includes(path)) {
    return null;
  }

  const handleChange = (_: any, value: any) => {
    history.push(value);
  };

  return (
    <Tabs
      value={path}
      onChange={handleChange}
      className={styles.tabs}
      TabIndicatorProps={{ style: { background: 'none' } }}
    >
      <Tab
        label="Swap"
        value="/swap"
        className={`${styles.tab} ${path === '/swap' && styles.active}`}
      />
      <Tab
        label="Liquidity"
        value="/liquidity"
        className={`${styles.tab} ${path === '/liquidity' && styles.active}`}
      />
    </Tabs>
  );
};
