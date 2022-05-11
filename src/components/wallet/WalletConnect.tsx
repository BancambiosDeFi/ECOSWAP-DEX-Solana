import { IconButton } from '@mui/material';
import ButtonComponent from '../../srm-components/Button/Button';
import { useScreenSize } from '../../utils/screenSize';
import { ReactComponent as WalletIcon } from '../../assets/icons/Wallet.svg';
import { useWallet } from './wallet';

export default function WalletConnect() {
  const { connected, connect, disconnect } = useWallet();
  const { isLaptop } = useScreenSize();

  return isLaptop ? (
    <IconButton
      color="inherit"
      aria-label="connect wallet"
      onClick={connected ? disconnect : connect}
      edge="start"
    >
      <WalletIcon />
    </IconButton>
  ) : (
    <div style={{ width: '' }}>
      <ButtonComponent
        type={'connect'}
        title={'Connect Wallet'}
        onClick={connected ? disconnect : connect}
        isIconVisible={false}
      />
    </div>
  );
}
