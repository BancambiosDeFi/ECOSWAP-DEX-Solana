import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { Connection } from '@solana/web3.js';
import CircleIcon from '@mui/icons-material/Circle';
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
    'margin': 0,
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
    justifyContent: 'center',
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
});

export default function UserWalletHeaderMenu() {
  const classes = useStyles();
  const { wallet, providerName, connected, disconnect } = useWallet();
  const [userBalance, setUserBalance] = useState('0');

  const networkMain = 'https://solana-mainnet.phantom.tech';
  // testnet balance
  // const networkTest = 'https://api.testnet.solana.com';
  // devnet balance
  // const networkDev = 'https://api.devnet.solana.com';

  useEffect(() => {
    if (wallet?.publicKey && connected) {
      const connection = new Connection(networkMain);
      const balancePromise = getBalance(connection, wallet.publicKey);

      balancePromise.then(number => {
        if (number === 0) setUserBalance('0');
        if (number > 0) setUserBalance(formattedBallance(number));
      });
    }
  }, [wallet, connected]);

  function getBalance(connection, publicKey) {
    return connection.getBalance(publicKey);
  }

  function formattedBallance(number) {
    const string = number.toString();

    return (
      string.slice(0, string.length - 9) + ',' + string.slice(string.length - 9, string.length - 8)
    );
  }

  return (
    <div className={classes.wrapperWalletMenu}>
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
        {userBalance} SOL
      </Typography>
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
    </div>
  );
}
