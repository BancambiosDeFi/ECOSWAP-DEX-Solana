import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Modal from '@mui/material/Modal';
import { Button } from '@mui/material';

import Wallet from '@project-serum/sol-wallet-adapter';

import { useConnectionConfig } from '../../srm-utils/connection';
// import { useLocalStorageState } from '../../srm-utils/utils';
import { WalletContextValues } from '../../srm-utils/types';
import { notify } from '../../srm-utils/notifications';
import { WalletAdapter } from './types';
import { PhantomWalletAdapter } from './phantom';
// import { SolflareExtensionWalletAdapter } from './solflare-extension';

export const WALLET_PROVIDERS = [
  {
    name: 'Solflare',
    url: 'https://solflare.com/access-wallet',
    icon: 'https://cdn.jsdelivr.net/gh/solana-labs/oyster@main/assets/wallets/solflare.svg',
  },
  // {
  //   name: 'Solflare Extension',
  //   url: 'https://solflare.com',
  //   icon:
  //     'https://cdn.jsdelivr.net/gh/solana-labs/oyster@main/assets/wallets/solflare.svg',
  //   adapter: SolflareExtensionWalletAdapter,
  // },
  {
    name: 'Phantom',
    url: 'https://www.phantom.app',
    icon: `https://www.phantom.app/img/logo.png`,
    adapter: PhantomWalletAdapter,
  },
];

const WalletContext = React.createContext<null | WalletContextValues>(null);

export function WalletProvider({ children }) {
  const { endpoint } = useConnectionConfig();

  const [autoConnect, setAutoConnect] = useState(false);
  const [providerUrl, setProviderUrl] = useState('https://www.phantom.app');
  // const [providerUrl, setProviderUrl] = useLocalStorageState('walletProvider');

  const provider = useMemo(() => WALLET_PROVIDERS.find(({ url }) => url === providerUrl), [
    providerUrl,
  ]);

  // eslint-disable-next-line prefer-const
  let [wallet, setWallet] = useState<WalletAdapter | undefined>(undefined);

  useEffect(() => {
    if (provider) {
      const updateWallet = () => {
        // hack to also update wallet synchronously in case it disconnects
        wallet = new (provider.adapter || Wallet)(providerUrl, endpoint) as WalletAdapter;
        setWallet(wallet);
      };

      if (document.readyState !== 'complete') {
        // wait to ensure that browser extensions are loaded
        const listener = () => {
          updateWallet();
          window.removeEventListener('load', listener);
        };
        window.addEventListener('load', listener);

        return () => window.removeEventListener('load', listener);
      } else {
        updateWallet();
      }
    }
  }, [provider, providerUrl, endpoint]);

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (wallet) {
      wallet.on('connect', () => {
        if (wallet?.publicKey) {
          localStorage.removeItem('feeDiscountKey');
          setConnected(true);
          notify({
            type: 'success',
            message: 'Wallet connected Successfully',
            description: 'Your wallet has been connected.',
          });
        }
      });

      wallet.on('disconnect', () => {
        setConnected(false);
        notify({
          type: 'success',
          message: 'Wallet update',
          description: 'Disconnected from wallet',
        });
        localStorage.removeItem('feeDiscountKey');
      });
    }

    return () => {
      setConnected(false);
      if (wallet && wallet.connected) {
        wallet.disconnect();
        setConnected(false);
      }
    };
  }, [wallet]);

  useEffect(() => {
    if (wallet && autoConnect) {
      wallet.connect();
      setAutoConnect(false);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }, [wallet, autoConnect]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const select = useCallback(() => setIsModalVisible(true), []);
  const close = useCallback(() => setIsModalVisible(false), []);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connected,
        select,
        providerUrl,
        setProviderUrl,
        providerName: WALLET_PROVIDERS.find(({ url }) => url === providerUrl)?.name ?? providerUrl,
      }}
    >
      {children}
      <Modal
        open={isModalVisible}
        onClose={close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            background: '#0A0C0E',
            width: 'auto',
            height: 'auto',
            margin: '0px auto',
            border: '1px solid #0156FF',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          {WALLET_PROVIDERS.map((provider, idx) => {
            const onClick = function () {
              setProviderUrl(provider.url);
              setAutoConnect(true);
              close();
            };

            return (
              <Button
                key={idx}
                size="large"
                onClick={onClick}
                startIcon={
                  <img
                    alt={`${provider.name}`}
                    width={20}
                    height={20}
                    src={provider.icon}
                    style={{ marginRight: 8 }}
                  />
                }
                style={{
                  width: '100%',
                  textAlign: 'left',
                  marginBottom: 8,
                  justifyContent: 'left',
                  color: '#FFFFFF',
                }}
              >
                {provider.name}
              </Button>
            );
          })}
        </div>
      </Modal>
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('Missing wallet context');
  }

  const wallet = context.wallet;

  return {
    connected: context.connected,
    wallet: wallet,
    providerUrl: context.providerUrl,
    setProvider: context.setProviderUrl,
    providerName: context.providerName,
    select: context.select,
    connect() {
      wallet ? wallet.connect() : context.select();
    },
    disconnect() {
      wallet?.disconnect();
    },
  };
}
