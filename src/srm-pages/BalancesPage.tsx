import React from 'react';
import { Tabs } from 'antd';
import { useAllOpenOrdersBalances, useWalletBalancesForAllMarkets } from '../srm-utils/markets';
import FloatingElement from '../srm-components/layout/FloatingElement';
import WalletBalancesTable from '../srm-components/UserInfoTable/WalletBalancesTable';
import { useMintToTickers } from '../srm-utils/tokens';

const { TabPane } = Tabs;

export default function BalancesPage() {
  const walletBalances = useWalletBalancesForAllMarkets();
  const mintToTickers = useMintToTickers();
  const openOrdersBalances = useAllOpenOrdersBalances();

  const data = (walletBalances || []).map(balance => {
    const balances = {
      coin: mintToTickers[balance.mint],
      mint: balance.mint,
      walletBalance: balance.balance,
      openOrdersFree: 0,
      openOrdersTotal: 0,
    };
    for (const openOrdersAccount of openOrdersBalances[balance.mint] || []) {
      balances['openOrdersFree'] += openOrdersAccount.free;
      balances['openOrdersTotal'] += openOrdersAccount.total;
    }

    return balances;
  });

  return (
    <FloatingElement style={{ flex: 1, paddingTop: 10 }}>
      <Tabs defaultActiveKey="walletBalances">
        <TabPane tab="Wallet Balances" key="walletBalances">
          <WalletBalancesTable walletBalances={data} />
        </TabPane>
      </Tabs>
    </FloatingElement>
  );
}
