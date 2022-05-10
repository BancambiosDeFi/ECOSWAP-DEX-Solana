// eslint-disable-next-line import/no-unresolved
import BN from 'bn.js';
import { PublicKey } from '@solana/web3.js';
import { Spin } from 'antd';
import { Basket, PoolInfo } from '@serum/pool';
import { useAccountInfo } from '../../../srm-utils/connection';
import { parseTokenMintData } from '../../../srm-utils/tokens';
import { MintName } from '../../../srm-components/MintName';

interface BasketDisplayProps {
  poolInfo: PoolInfo;
  basket?: Basket | null | undefined;
}

export default function PoolBasketDisplay({ poolInfo, basket }: BasketDisplayProps) {
  return (
    <ul>
      {poolInfo.state.assets.map((asset, index) => (
        <BasketItem key={index} mint={asset.mint} quantity={basket?.quantities[index]} />
      ))}
    </ul>
  );
}

interface BasketItemProps {
  mint: PublicKey;
  quantity?: BN;
}

function BasketItem({ mint, quantity }: BasketItemProps) {
  const [mintAccountInfo] = useAccountInfo(mint);
  let quantityDisplay = <Spin size="small" />;
  if (mintAccountInfo && quantity) {
    const mintInfo = parseTokenMintData(mintAccountInfo.data);
    quantityDisplay = <>{quantity.toNumber() / 10 ** mintInfo.decimals}</>;
  }

  return (
    <li>
      {quantityDisplay} <MintName mint={mint} showAddress />
    </li>
  );
}
