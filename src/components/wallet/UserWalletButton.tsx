import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import CircleIcon from '@mui/icons-material/Circle';
import { useWallet } from './wallet';

const useStyles = makeStyles({
  container: {
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
    'border': '1px solid',
    'borderColor': '#EC26F5',
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

export default function UserWalletButton() {
  const classes = useStyles();
  const { wallet, providerName, connected, disconnect } = useWallet();

  return (
    <Box className={classes.container} onClick={disconnect}>
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
  );
}
