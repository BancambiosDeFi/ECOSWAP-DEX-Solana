import React, { Suspense } from 'react';
import './App.less';
import { ConnectionProvider } from './srm-utils/connection';
import { WalletProvider } from './srm-utils/wallet';
import { GlobalStyle } from './global_style';
import { Spin } from 'antd';
import ErrorBoundary from './srm-components/ErrorBoundary';
import { Routes } from './routes';
import { PreferencesProvider } from './srm-utils/preferences';
import { ReferrerProvider } from './srm-utils/referrer';

export default function App() {
  return (
    <Suspense fallback={() => <Spin size="large" />}>
      <GlobalStyle />
      <ErrorBoundary>
        <ConnectionProvider>
          <ReferrerProvider>
            <WalletProvider>
              <PreferencesProvider>
                <Suspense fallback={() => <Spin size="large" />}>
                  <Routes />
                </Suspense>
              </PreferencesProvider>
            </WalletProvider>
          </ReferrerProvider>
        </ConnectionProvider>
      </ErrorBoundary>
    </Suspense>
  );
}
