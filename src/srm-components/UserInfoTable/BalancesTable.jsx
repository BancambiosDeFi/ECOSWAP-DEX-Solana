import { Button } from 'antd';
import React from 'react';
import {
  useTokenAccounts,
  getSelectedTokenAccountForMint,
} from '../../srm-utils/markets';
import DataTable from '../layout/DataTable';
import { useSendConnection } from '../../srm-utils/connection';
import { useWallet } from '../../components/wallet/wallet';
import { settleFunds } from '../../srm-utils/send';
import { notify } from '../../srm-utils/notifications';
import { useReferrer } from '../../srm-utils/referrer';

export default function BalancesTable({
  balances,
  showMarket,
  hideWalletBalance,
  onSettleSuccess,
}) {
  const [accounts] = useTokenAccounts();
  const connection = useSendConnection();
  const { wallet } = useWallet();
  const { usdcRef, usdtRef } = useReferrer();

  async function onSettleFunds(market, openOrders) {
    try {
      await settleFunds({
        market,
        openOrders,
        connection,
        wallet,
        baseCurrencyAccount: getSelectedTokenAccountForMint(
          accounts,
          market?.baseMintAddress,
        ),
        quoteCurrencyAccount: getSelectedTokenAccountForMint(
          accounts,
          market?.quoteMintAddress,
        ),
        usdcRef,
        usdtRef,
      });
    } catch (e) {
      notify({
        message: 'Error settling funds',
        description: e.message,
        type: 'error',
      });
      return;
    }
    onSettleSuccess && onSettleSuccess();
  }

  const columns = [
    showMarket
      ? {
          title: 'Market',
          dataIndex: 'marketName',
          key: 'marketName',
        }
      : null,
    {
      title: 'Coin',
      dataIndex: 'coin',
      key: 'coin',
    },
    hideWalletBalance
      ? null
      : {
          title: 'Wallet Balance',
          dataIndex: 'wallet',
          key: 'wallet',
        },
    {
      title: 'Orders',
      dataIndex: 'orders',
      key: 'orders',
    },
    {
      title: 'Unsettled',
      dataIndex: 'unsettled',
      key: 'unsettled',
    },
    {
      key: 'action',
      render: ({ market, openOrders, marketName }) => (
        <div style={{ textAlign: 'right' }}>
          <Button
            ghost
            style={{ marginRight: 12 }}
            onClick={() => onSettleFunds(market, openOrders)}
          >
            Settle {marketName}
          </Button>
        </div>
      ),
    },
  ].filter((x) => x);
  return (
    <DataTable
      emptyLabel="No balances"
      dataSource={balances}
      columns={columns}
      pagination={false}
    />
  );
}
