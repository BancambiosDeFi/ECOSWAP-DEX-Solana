import { Button, Row } from 'antd';
import FloatingElement from '../srm-components/layout/FloatingElement';
import { useAllMarkets, useAllOpenOrders, useMarketInfos } from '../srm-utils/markets';
import OpenOrderTable from '../srm-components/UserInfoTable/OpenOrderTable';
import { OrderWithMarketAndMarketName } from '../srm-utils/types';
import { useWallet } from '../components/wallet/wallet';
import WalletConnect from '../components/wallet/WalletConnect';

export default function OpenOrdersPage() {
  const { connected } = useWallet();
  const { openOrders, loaded, refreshOpenOrders } = useAllOpenOrders();
  const marketInfos = useMarketInfos();
  const marketAddressesToNames = Object.fromEntries(
    marketInfos.map(info => [info.address.toBase58(), info.name]),
  );
  const [allMarkets] = useAllMarkets();
  const marketsByAddress = Object.fromEntries(
    (allMarkets || []).map(marketInfo => [marketInfo.market.address.toBase58(), marketInfo.market]),
  );

  const dataSource: OrderWithMarketAndMarketName[] = (openOrders || [])
    .map(orderInfos =>
      orderInfos.orders.map(order => {
        return {
          marketName: marketAddressesToNames[orderInfos.marketAddress],
          market: marketsByAddress[orderInfos.marketAddress],
          ...order,
        };
      }),
    )
    .flat();

  if (!connected) {
    return (
      <Row
        justify="center"
        style={{
          marginTop: '10%',
        }}
      >
        <WalletConnect />
      </Row>
    );
  }

  return (
    <FloatingElement /* style={{ flex: 1, paddingTop: 10 }} */>
      <Button onClick={refreshOpenOrders} loading={!loaded}>
        Refresh
      </Button>
      <OpenOrderTable
        openOrders={dataSource}
        pageSize={25}
        loading={!loaded}
        onCancelSuccess={refreshOpenOrders}
        marketFilter
      />
    </FloatingElement>
  );
}
