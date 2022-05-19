import { useEffect, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import CircleIcon from '@mui/icons-material/Circle';

import { getImpactPool, getUserImpactValue } from '../../utils';
import { useScreenSize } from '../../utils/screenSize';
import { ReactComponent as WalletIcon } from '../../assets/icons/Wallet.svg';
import { useWallet } from './wallet';

const useStyles = makeStyles({
  wrapperWalletMenu: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  containerButton: {
    'userSelect': 'none',
    'cursor': 'pointer',
    'width': '169.22px',
    'height': '51px',
    'display': 'grid',
    'gridTemplateColumns': '10% 70% 20%',
    'gridTemplateRows': 'auto',
    'gridTemplateAreas': `'space publicKey expandMore'
    'space providerName expandMore'`,
    'margin': '10px 0',
    'padding': '0',
    'background': '#0D1226',
    'border': '0.5px solid #0156FF',
    'borderRadius': '8px',
    'alignItems': 'center',
    '&:hover': {
      background: 'rgba(1, 86, 255, 0.3)',
    },
  },
  publicKey: {
    width: '100%',
    fontSize: '16px',
    lineHeight: '25px',
    fontFamily: '"Saira", sans-serif',
    fontWeight: '400',
  },
  expandMore: {
    lineHeight: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  providerName: {
    display: 'flex',
    justifyContent: 'start',
    lineHeight: '25px',
    fontFamily: '"Saira", sans-serif',
    fontSize: '14px',
    fontWeight: '600',
  },
  modalContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'red',
  },
  textBalance: {
    width: '60px',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '16px',
    lineHeight: '46px',
    fontFamily: '"Saira", sans-serif',
  },
});

export default function UserWalletHeaderMenu() {
  const classes = useStyles();
  const [userImpactValue, setUserImpactValue] = useState<number>(0);
  const { wallet, providerName, connected, disconnect } = useWallet();
  const { isDesktop, isLargeDesktop } = useScreenSize();

  useEffect(() => {
    if (wallet?.publicKey && connected) {
      getUserImpactValue(getImpactPool(wallet.publicKey, 'USDT')).then(impactValue => {
        setUserImpactValue(impactValue);
      });
    }
  }, [wallet, connected]);

  return (
    <div className={classes.wrapperWalletMenu}>
      {isDesktop && (
        <>
          <Typography
            style={{
              width: '40px',
              fontStyle: 'normal',
              fontWeight: 'bold',
              fontSize: '30.6667px',
            }}
          >
            🌏
          </Typography>
          <Typography
            style={{
              width: '80px',
              fontStyle: 'normal',
              fontWeight: 'bold',
              fontSize: '16px',
              lineHeight: '46px',
              margin: '10px',
            }}
          >
            {userImpactValue}
          </Typography>
        </>
      )}
      {isLargeDesktop ? (
        <Box className={classes.containerButton} onClick={disconnect}>
          <Box style={{ gridArea: 'publicKey' }}>
            <Typography variant="inherit" align="center" noWrap className={classes.publicKey}>
              {wallet?.publicKey.toBase58()}
            </Typography>
          </Box>
          <Box style={{ gridArea: 'expandMore' }}>
            <Typography variant="inherit" className={classes.expandMore}>
              <ExpandMoreRoundedIcon sx={{ fontSize: 40 }} />
            </Typography>
          </Box>
          <Box style={{ gridArea: 'providerName' }}>
            <Typography variant="inherit" align="center" className={classes.providerName}>
              <CircleIcon sx={{ color: '#0156FF', fontSize: 15, margin: '5px 5px 0 0' }} />
              {providerName}
            </Typography>
          </Box>
        </Box>
      ) : (
        <IconButton color="inherit" aria-label="connect wallet" onClick={disconnect} edge="start">
          <WalletIcon />
        </IconButton>
      )}
    </div>
  );
}
