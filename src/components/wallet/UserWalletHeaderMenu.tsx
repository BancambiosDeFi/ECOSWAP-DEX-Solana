import { useEffect, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { Connection } from '@solana/web3.js';
import CircleIcon from '@mui/icons-material/Circle';

import { formattedBallance, getBalance } from '../../utils';
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
    'margin': "10px 0",
    'padding': '0',
    'background': 'rgba(159, 90, 229, 0.3)',
    'border': 'solid 1px transparent',
    'backgroundImage':
      // eslint-disable-next-line max-len
      'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, #9F5AE5, #EC26F5)',
    'backgroundOrigin': 'border-box',
    'backgroundClip': 'content-box, border-box',
    'boxShadow': '2px 500px #431e68 inset',
    'borderRadius': '20px',
    'alignItems': 'center',
    '&:hover': {
      background: 'rgba(1, 86, 255, 0.3)',
    },
    '@media(max-width: 1150px)': {
      width: '100px',
      margin: 'auto 5px',
    },
    '@media(max-width: 950px)': {
      width:'90px',
    }
  },
  publicKey: {
    width: '100%',
    fontSize: '16px',
    lineHeight: '25px',
    fontFamily: '"Saira", sans-serif',
    fontWeight: '400',
    '@media(max-width: 1150px)': {
      fontSize: '14px',
    },
    '@media(max-width: 950px)': {
      fontSize: '12px',
    }
  },
  expandMore: {
    lineHeight: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  providerName: {
    display: 'flex',
    justifyContent: 'center',
    lineHeight: '25px',
    fontFamily: '"Saira", sans-serif',
    fontSize: '14px',
    fontWeight: '600',
    '@media(max-width: 1150px)': {
      fontSize: '12px',
    }
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
    '@media(max-width: 1150px)': {
      fontSize: '14px',
      width: '40px',
    },
    '@media(max-width: 950px)': {
      fontSize: '12px',
      width: '35px',
    }
  },
});

export default function UserWalletHeaderMenu() {
  const classes = useStyles();
  const [userBalance, setUserBalance] = useState('0');
  const { wallet, providerName, connected, disconnect } = useWallet();
  const { isLaptop, isDesktop, isLargeDesktop } = useScreenSize();
  console.log(isLaptop);

  useEffect(() => {
    if (wallet?.publicKey && connected) {
      const connection = new Connection(process.env.REACT_APP_NETWORK as string);

      getBalance(connection, wallet.publicKey).then(lamportsBalance => {
        lamportsBalance > 0
          ? setUserBalance(formattedBallance(lamportsBalance))
          : setUserBalance('0');
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
            {userBalance}
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
              <CircleIcon sx={{ color: '#DC1FFF', fontSize: 15, marginTop: '5px' }} />
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
