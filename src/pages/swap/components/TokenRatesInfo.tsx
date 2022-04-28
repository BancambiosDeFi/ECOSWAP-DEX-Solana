import React, { useEffect, useState } from 'react';
import { Typography, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  useTokenMap,
  useSwapContext,
  useMint,
  useFairRoute,
  // eslint-disable-next-line import/no-unresolved
} from '@serum/swap-ui';
import { ReactComponent as SwitchIcon } from '../../../assets/icons/switch-icon.svg';

const useStyles = makeStyles(() => ({
  infoLabel: {
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'center',
  },
  infoButton: {
    marginLeft: '5px',
    padding: 0,
    fontSize: '14px',
  },
  infoLabelIcon: {
    width: '21px',
    height: '21px',
    background: '#202124',
    transform: 'rotate(90deg)',
    borderRadius: '50%',
    padding: '3px',
  },
}));

const TokenRatesInfo: React.FC = () => {
  const styles = useStyles();

  const { fromMint, toMint } = useSwapContext();
  const fromMintInfo = useMint(fromMint);
  const toMintInfo = useMint(toMint);
  const fromFair = useFairRoute(fromMint, toMint);
  const toFair = useFairRoute(toMint, fromMint);
  const tokenMap = useTokenMap();
  const fromTokenInfo = tokenMap.get(fromMint.toString());
  const toTokenInfo = tokenMap.get(toMint.toString());
  const [rates, setRates] = useState<string>('-');
  const [ratesDirection, setRatesDirection] = useState<string>('to');

  const handleSwitchRatesClick = () => {
    setRatesDirection(ratesDirection === 'to' ? 'from' : 'to');
  };

  useEffect(() => {
    if (ratesDirection === 'to') {
      setRates(
        toFair !== undefined && fromTokenInfo && toTokenInfo && toMintInfo
          ? `1 ${fromTokenInfo.symbol} ≈ ${toFair.toFixed(toMintInfo?.decimals)} ${
              toTokenInfo.symbol
            }`
          : `-`,
      );
    } else {
      setRates(
        fromFair !== undefined && toTokenInfo && fromTokenInfo && fromMintInfo
          ? `1 ${toTokenInfo.symbol} ≈ ${fromFair.toFixed(fromMintInfo?.decimals)} ${
              fromTokenInfo.symbol
            }`
          : `-`,
      );
    }
  }, [
    ratesDirection,
    rates,
    toFair,
    fromFair,
    fromTokenInfo?.symbol,
    toTokenInfo?.symbol,
    toMintInfo?.decimals,
    fromMintInfo?.decimals,
  ]);

  return (
    <div className={styles.infoLabel}>
      <Typography
        style={{
          fontFamily: 'Saira',
          fontSize: '16px',
          fontStyle: 'normal',
          fontWeight: 800,
          lineHeight: '40px',
          letterSpacing: '0em',
          textAlign: 'center',
          color: '#FFFFFF',
        }}
      >
        {rates}
      </Typography>
      <div style={{ display: 'flex' }}>
        <IconButton className={styles.infoButton} onClick={handleSwitchRatesClick}>
          <SwitchIcon className={styles.infoLabelIcon} />
        </IconButton>
      </div>
    </div>
  );
};

export default TokenRatesInfo;
