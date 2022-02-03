import React from 'react';
import ButtonComponent from '../../srm-components/Button/Button';
import { useWallet } from './wallet';

export default function WalletConnect() {
  const { connected, connect, disconnect } = useWallet();

  return (
    <ButtonComponent
      type={'connect'}
      title={'Connect Wallet'}
      onClick={connected ? disconnect : connect}
      isIconVisible={false}
    ></ButtonComponent>
  );
}
