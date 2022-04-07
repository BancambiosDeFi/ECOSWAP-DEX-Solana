import React from 'react';
import { makeStyles } from '@mui/styles';
import CircularProgress from '@mui/material/CircularProgress';
import { useWallet } from '../../components/wallet/wallet';
import ButtonComponent from '../../srm-components/Button/Button';
import WalletConnectSwap from '../../components/wallet/WalletConnectSwap';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = makeStyles(theme => ({
  loaderWrap: {
    display: 'flex',
    justifyContent: 'center',
  },
  loader: {
    '&&': {
      color: 'rgb(127, 70, 251)',
    },
  },
}));

export const AddLiquidityButton = ({
  disabled = false,
  loading = false,
  title = '',
  onClick,
}: {
  disabled: boolean;
  loading: boolean;
  title: string;
  onClick: () => void;
}) => {
  const { connected } = useWallet();

  if (connected) {
    return (
      <ButtonComponent
        type={'swap'}
        title={title}
        onClick={onClick}
        disable={disabled}
        loading={loading}
        isIconVisible={false}
      />
    );
  } else {
    return <WalletConnectSwap loading={loading} />;
  }
};
