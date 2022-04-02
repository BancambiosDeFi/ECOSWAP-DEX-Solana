import React from 'react';
import { useWallet } from '../../components/wallet/wallet';
import ButtonComponent from '../../srm-components/Button/Button';
import WalletConnectSwap from '../../components/wallet/WalletConnectSwap';

export const AddLiquidityButton = ({
  disabled = false,
  title = '',
  onClick,
}: {
  disabled: boolean;
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
        isIconVisible={false}
      />
    );
  } else {
    return <WalletConnectSwap />;
  }
};
