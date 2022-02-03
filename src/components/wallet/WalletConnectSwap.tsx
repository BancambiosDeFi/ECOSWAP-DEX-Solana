import React from 'react';
import { useWallet } from './wallet';
import ButtonComponent from '../../srm-components/Button/Button';

export default function WalletConnectSwap() {
  const { connected, connect, disconnect } = useWallet();

  return (
    <ButtonComponent
      type={'connectSwap'}
      title={'Connect Wallet'}
      onClick={connected ? disconnect : connect}
      isIconVisible={false}
    ></ButtonComponent>
  );
}
