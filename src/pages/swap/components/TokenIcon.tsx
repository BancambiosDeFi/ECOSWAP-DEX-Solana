import { PublicKey } from '@solana/web3.js';
import { makeStyles } from '@mui/styles';

import { useTokenMap } from '@serum/swap-ui';

const useStyles = makeStyles(theme => ({
  tokenIconImage: {
    'height': '45px',
    'width': '45px',
    '@media(max-width: 540px)': {
      height: '35px',
      width: '35px',
    },
  },
}));

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
  const styles = useStyles();
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
        className={styles.tokenIconImage}
        alt="Logo"
        src={tokenInfo?.logoURI}
        style={{
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
