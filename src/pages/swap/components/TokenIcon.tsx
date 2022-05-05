import React from 'react';
import { PublicKey } from '@solana/web3.js';

import { useTokenMap } from '@serum/swap-ui';

export function TokenIcon({
  mint,
  style,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  className = '',
  onError,
}: {
  mint: PublicKey;
  style?: any;
  className?: string;
  onError?: any;
}) {
  const tokenMap = useTokenMap();
  const tokenInfo = tokenMap.get(mint.toString());

  if (!tokenInfo?.logoURI) {
    onError(true);

    return null;
  }

  return (
    <div
      role="isExistTokenIconComponent"
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <img
        alt="Logo"
        src={tokenInfo?.logoURI}
        style={{
          height: '45px',
          width: '45px !important',
          ...style,
        }}
        onError={() => {
          if (onError) {
            onError(true);
          }
        }}
      />
    </div>
  );
}
