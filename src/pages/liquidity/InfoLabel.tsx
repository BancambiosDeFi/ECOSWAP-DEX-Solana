import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useMint, useSwapContext, useSwapFair, useTokenMap } from '@serum/swap-ui';

const useStyles = makeStyles(() => ({
  infoLabel: {
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'center',
    marginBottom: '18px',
  },
  infoText: {
    '&&': {
      fontFamily: 'Saira',
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '26px',
      textAlign: 'center',
      color: '#FFFFFF',
    },
  },
  infoLabelIcon: {
    color: 'white',
    position: 'relative',
  },
}));

export const InfoLabel = () => {
  const styles = useStyles();

  const { fromMint, toMint } = useSwapContext();
  const fromMintInfo = useMint(fromMint);
  const fair = useSwapFair();

  const tokenMap = useTokenMap();
  const fromTokenInfo = tokenMap.get(fromMint.toString());
  const toTokenInfo = tokenMap.get(toMint.toString());

  if (fair === undefined || !toTokenInfo || !fromTokenInfo) {
    return null;
  }

  // TODO: remove hardcode in brackets
  return (
    <div className={styles.infoLabel}>
      <Typography className={styles.infoText}>
        {`1 ${toTokenInfo.symbol} = ${fair.toFixed(fromMintInfo?.decimals)} ${
          fromTokenInfo.symbol
        } ($0.99955)`}
      </Typography>
    </div>
  );
};
