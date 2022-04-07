import React from 'react';
import ButtonComponent from '../../srm-components/Button/Button';
import { useWallet } from './wallet';

export default function WalletConnectSwap({ loading = false }: { loading?: boolean }) {
  const { connected, connect, disconnect } = useWallet();

  return (
    <ButtonComponent
      type={'connectSwap'}
      title={'Connect Wallet'}
      onClick={connected ? disconnect : connect}
      isIconVisible={false}
      loading={loading}
    />
  );
}
