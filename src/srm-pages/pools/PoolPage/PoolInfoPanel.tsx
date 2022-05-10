// eslint-disable-next-line import/no-unresolved
import { Typography } from 'antd';
import tuple from 'immutable-tuple';
import { getPoolBasket, PoolInfo } from '@serum/pool';
import FloatingElement from '../../../srm-components/layout/FloatingElement';
import { MintInfo } from '../../../srm-utils/tokens';
import { useAsyncData } from '../../../srm-utils/fetch-loop';
import { useConnection } from '../../../srm-utils/connection';
import PoolBasketDisplay from './PoolBasketDisplay';

const { Text, Paragraph } = Typography;

interface PoolInfoProps {
  poolInfo: PoolInfo;
  mintInfo: MintInfo;
}

const feeFormat = new Intl.NumberFormat(undefined, {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 6,
});

export default function PoolInfoPanel({ poolInfo, mintInfo }: PoolInfoProps) {
  const connection = useConnection();

  const [totalBasket] = useAsyncData(
    () => getPoolBasket(connection, poolInfo, { redeem: mintInfo.supply }),
    tuple(getPoolBasket, connection, poolInfo, 'total', mintInfo),
  );

  return (
    <FloatingElement stretchVertical>
      <Paragraph>Name: {poolInfo.state.name}</Paragraph>
      <Paragraph>
        Address: <Text copyable>{poolInfo.address.toBase58()}</Text>
      </Paragraph>
      <Paragraph>
        Pool token mint address: <Text copyable>{poolInfo.state.poolTokenMint.toBase58()}</Text>
      </Paragraph>
      {poolInfo.state.adminKey ? (
        <Paragraph>
          Pool admin: <Text copyable>{poolInfo.state.adminKey.toBase58()}</Text>
        </Paragraph>
      ) : null}
      <Paragraph>Fee rate: {feeFormat.format(poolInfo.state.feeRate / 1_000_000)}</Paragraph>
      <Paragraph>Total supply: {mintInfo.supply.toNumber() / 10 ** mintInfo.decimals}</Paragraph>
      <Text>Total assets:</Text>
      <div>
        <PoolBasketDisplay poolInfo={poolInfo} basket={totalBasket} />
      </div>
    </FloatingElement>
  );
}
