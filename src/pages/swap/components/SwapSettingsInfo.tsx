/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { makeStyles } from '@mui/styles';
import { Box, IconButton, Typography } from '@mui/material';
import { ReactComponent as InfoIcon } from '../../../assets/icons/info-icon.svg';
import { useSwapContext } from '@serum/swap-ui';

interface SwapSettingsProps {
  minimumReceived: number;
  toTokenSymbol: string;
  priceImpact: string;
  swapSettingOptions: { label: string; id: string; getDescription: () => string }[];
  popoverId: string | undefined;
  handleInfoButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  infoIconStyle: string;
}

// @ts-ignore
const useStyles = makeStyles(theme => ({
  swapInfoWrapper: {
    width: '100%',
    height: 'fit-content',
    minHeight: '132px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#202124',
    borderRadius: '20px',
    padding: '8px 16px',
    marginBottom: '10px',
  },
  swapInfoSideBlock: {
    width: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  swapInfoLeftSide: {
    width: 'fit-content',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  swapInfoText: {
    fontFamily: 'Saira !important',
    fontStyle: 'normal',
    fontWeight: '400 !important',
    fontSize: '16px !important',
    lineHeight: '29px !important',
    textAlign: 'left',
    color: '#FFFFFF',
  },
  infoPopover: {},
}));

const SwapSettingsInfo: React.FC<SwapSettingsProps> = ({
  minimumReceived,
  toTokenSymbol,
  priceImpact,
  swapSettingOptions,
  popoverId,
  handleInfoButtonClick,
  infoIconStyle,
}) => {
  const styles = useStyles();
  const { slippage } = useSwapContext();

  return (
    <Box className={styles.swapInfoWrapper}>
      <Box className={styles.swapInfoSideBlock}>
        {swapSettingOptions.map((option, index) => (
          <Box className={styles.swapInfoLeftSide} key={index}>
            <Typography className={styles.swapInfoText}>{option.label}</Typography>
            <IconButton
              className={infoIconStyle}
              size="small"
              aria-describedby={popoverId}
              onClick={handleInfoButtonClick}
              id={option.id}
            >
              <InfoIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
      <Box className={styles.swapInfoSideBlock}>
        <Typography className={styles.swapInfoText}>{slippage.toString()}%</Typography>
        <Typography className={styles.swapInfoText}>BX Pool</Typography>
        <Typography className={styles.swapInfoText}>
          {minimumReceived} {toTokenSymbol}
        </Typography>
        <Typography className={styles.swapInfoText}>
          {priceImpact ? priceImpact + '%' : '-'}
        </Typography>
      </Box>
    </Box>
  );
};

export default SwapSettingsInfo;
