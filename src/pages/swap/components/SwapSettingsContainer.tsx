/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { makeStyles, styled } from '@mui/styles';
import {
  Box,
  IconButton,
  Popover,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
// eslint-disable-next-line prettier/prettier
import {
  SettingsOutlined as SettingsIcon,
  CachedOutlined as UpdateIcon,
} from '@mui/icons-material';
import NumberFormat from 'react-number-format';
import { LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
// eslint-disable-next-line import/no-unresolved
import { useMint, useSwapContext, useTokenMap } from '@serum/swap-ui';
import CloseIcon from '@mui/icons-material/Close';
import {
  convertToBN,
  convertToPercent,
  createToken,
  createTokenAmount,
  getAllRaydiumPoolKeys,
  getPriceImpact,
  getRaydiumPoolInfo,
} from '../../../utils/raydiumRequests';
import { useConnection } from '../../../srm-utils/connection';
import {
  getEcoContributionDescription,
  getMinimumReceivedDescription,
  getPriceImpactDescription,
  getSlippageToleranceDescription,
  getSwapPoolDescription,
} from '../../../utils/descriptions';
import { ReactComponent as InfoIcon } from '../../../assets/icons/info-icon.svg';
import SwapSettingsInfo from './SwapSettingsInfo';
import SlippageToleranceSettings from './SlippageToleranceSettings';
import { InfoLabel } from './Info';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

interface SwapSettingsProps {
  slippageTolerance: string;
  setSlippageTolerance: React.Dispatch<React.SetStateAction<string>>;
  ecoImpactType: string;
  setEcoImpactType: React.Dispatch<React.SetStateAction<string>>;
  ecoImpactValue: string;
  setEcoImpactValue: React.Dispatch<React.SetStateAction<string>>;
}

const swapSettingOptions = [
  {
    label: 'Slippage Tolerance',
    id: 'slippage-tolerance',
    getDescription: getSlippageToleranceDescription,
  },
  {
    label: 'Swapping Through',
    id: 'swapping-through',
    getDescription: getSwapPoolDescription,
  },
  {
    label: 'Minimum Received',
    id: 'minimum-received',
    getDescription: getMinimumReceivedDescription,
  },
  {
    label: 'Price Impact',
    id: 'price-impact',
    getDescription: getPriceImpactDescription,
  },
];

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'left',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    maxWidth: '435px',
    borderRadius: theme.spacing(2.5),
    boxSizing: 'border-box',
    marginBottom: theme.spacing(2),
  },
  infoHeader: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box',
    padding: '0 0 10px 10px',
  },
  infoHeaderBlock: {
    display: 'flex',
    flexDirection: 'row',
  },
  headerIconWrapper: {
    width: '44px !important',
    height: '44px !important',
    backgroundColor: 'rgba(65, 63, 63, 1) !important',
    borderRadius: '14px !important',
    marginLeft: '6px !important',
  },
  icon: {
    color: '#FFFFFF',
  },
  infoIcon: {
    width: 'fit-content !important',
    height: 'fit-content !important',
    padding: '0 !important',
    marginLeft: '8px !important',
  },
  ecoImpactWrapper: {
    width: '100%',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: '10px',
  },
  ecoImpactSideBlock: {
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  ecoImpactTitleText: {
    fontFamily: 'Saira !important',
    fontStyle: 'normal',
    fontWeight: '800 !important',
    fontSize: '16px !important',
    lineHeight: '40px !important',
    textAlign: 'left',
    color: '#FFFFFF',
  },
  ecoImpactValueText: {
    fontFamily: 'Saira !important',
    fontStyle: 'normal',
    fontWeight: '700 !important',
    fontSize: '24px !important',
    lineHeight: '38px !important',
    textAlign: 'left',
    color: '#FFFFFF',
  },
  earthIcon: {
    marginRight: '14px',
    transform: 'scale(2)',
  },
  ecoImpactSettingsIconWrapper: {
    width: '22px !important',
    height: '20px !important',
    marginLeft: '12px !important',
    marginRight: '10px !important',
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
  closeEcoContributionSettingsButton: {
    color: '#FFFFFF !important',
    marginLeft: '8px !important',
  },
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    'width': '35px',
    'height': '27px',
    'border': 'none',
    'padding': 0,
    'fontFamily': 'Saira !important',
    'fontStyle': 'normal',
    'fontWeight': '400 !important',
    'fontSize': '22px !important',
    'lineHeight': '38px !important',
    'color': '#FFFFFF',
    '&.Mui-selected': {
      background: 'rgba(72, 74, 81, 1) !important',
      color: '#FFFFFF',
      borderRadius: '8px !important',
    },
  },
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-input': {
    zIndex: 1,
    color: '#FFFFFF',
    fontFamily: '"Saira", sans-serif',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '29px',
    letterSpacing: '0em',
    textAlign: 'left',
    padding: '0 10px',
  },
  '& .MuiOutlinedInput-root': {
    width: '57px',
    height: '29px',
    marginLeft: '9px',
    marginRight: '5px',
    background:
      'linear-gradient(#1E2022, #1E2022) padding-box, linear-gradient(to right, #EC26F5, #0156FF ) border-box',
    borderRadius: '8px',
    border: '2px solid transparent',
  },
  '& .MuiOutlinedInput-root:before': {
    content: '',
    position: 'absolute',
    top: '-5px',
    bottom: '-5px',
    left: '-5px',
    right: '-5px',
    border: '2px solid #222',
    borderRadius: '.8rem',
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledPopover = styled(Popover)(({ theme }) => ({
  '& .MuiPopover-paper': {
    width: 'fit-content',
    height: 'fit-content',
    maxWidth: '453px',
    padding: '8px 16px',
    backgroundColor: 'rgba(53, 54, 58, 1)',
  },
}));

const NumberFormatCustom = React.forwardRef<NumberFormat<CustomProps>, CustomProps>(
  function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        onValueChange={values => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        isNumericString
        allowNegative={false}
        decimalScale={1}
      />
    );
  },
);

const SwapSettingsContainer: React.FC<SwapSettingsProps> = ({
  slippageTolerance,
  setSlippageTolerance,
  ecoImpactType,
  setEcoImpactType,
  ecoImpactValue,
  setEcoImpactValue,
}) => {
  const styles = useStyles();
  const [isSettings, setIsSettings] = useState<boolean>(false);
  const [isEcoImpactSettings, setIsEcoImpactSettings] = useState<boolean>(false);
  const { fromMint, toMint, fromAmount, toAmount } = useSwapContext();
  const tokenMap = useTokenMap();
  const toTokenInfo = tokenMap.get(toMint.toString());
  const fromTokenInfo = tokenMap.get(fromMint.toString());
  const toMintInfo = useMint(toMint);
  const fromMintInfo = useMint(fromMint);
  const connection = useConnection();
  const [raydiumPoolKeys, setRaydiumPoolKeys] = useState<LiquidityPoolKeysV4[] | null>(null);
  const [minimumReceived, setMinimumReceived] = useState<number>(toAmount);
  const [priceImpact, setPriceImpact] = useState<string>('');
  const [infoText, setInfoText] = useState<string>('');
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const popoverId = open ? 'simple-popover' : undefined;

  useEffect(() => {
    getAllRaydiumPoolKeys(connection).then(poolKeys => {
      console.log('Pools added!');
      setRaydiumPoolKeys(poolKeys);
    });
  }, []);

  useEffect(() => {
    if (toAmount) {
      const minReceived = toAmount - toAmount * (Number(slippageTolerance) / 100);

      const formattedMinReceived =
        toMintInfo && minReceived
          ? Number(
              minReceived.toLocaleString('fullwide', {
                maximumFractionDigits: toMintInfo.decimals,
                useGrouping: false,
              }),
            )
          : minReceived;

      setMinimumReceived(formattedMinReceived);
    }
  }, [toAmount, minimumReceived, slippageTolerance, toMintInfo]);

  useEffect(() => {
    if (toAmount && toMint && raydiumPoolKeys && fromMintInfo && toMintInfo) {
      const filteredPoolKeys = raydiumPoolKeys.filter(
        pool =>
          (pool.baseMint.equals(fromMint) && pool.quoteMint.equals(toMint)) ||
          (pool.baseMint.equals(toMint) && pool.quoteMint.equals(fromMint)),
      );

      if (filteredPoolKeys.length > 0) {
        getRaydiumPoolInfo({ connection, poolKeys: filteredPoolKeys[0] })
          .then(poolInfo => {
            const amountIn = createTokenAmount(
              createToken(
                fromMint.toString(),
                // @ts-ignore
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                fromMintInfo?.decimals,
                // @ts-ignore
                fromTokenInfo?.symbol,
                fromTokenInfo?.name,
              ),
              // @ts-ignore
              convertToBN(fromAmount * Math.pow(10, fromMintInfo?.decimals)),
            );
            const currencyOut = createToken(
              // @ts-ignore
              toMint.toString(),
              // @ts-ignore
              toMintInfo?.decimals,
              // @ts-ignore
              toTokenInfo?.symbol,
              // @ts-ignore
              toTokenInfo?.name,
            );
            const slippage = convertToPercent(Number(slippageTolerance) * 10, 1000);

            setPriceImpact(
              getPriceImpact({
                poolKeys: filteredPoolKeys[0],
                poolInfo,
                amountIn,
                currencyOut,
                slippage,
              }),
            );
          })
          .catch(e => {
            console.error('Liquidity.fetchInfo ERROR:', e);
            setPriceImpact('');
          });
      } else {
        console.error(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          `Price Impact ERROR: "${fromTokenInfo?.symbol}-${toTokenInfo?.symbol}" or ` +
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            `"${toTokenInfo?.symbol}-${fromTokenInfo?.symbol}" Raydium liquidity pool doesn't exist!`,
        );
        setPriceImpact('');
      }
    } else {
      setPriceImpact('');
    }
  }, [
    toAmount,
    toMint,
    raydiumPoolKeys,
    fromMintInfo,
    toMintInfo,
    connection,
    fromAmount,
    fromMint,
    fromTokenInfo,
    slippageTolerance,
    toTokenInfo,
  ]);

  const handleSettingsClick = () => {
    setIsSettings(!isSettings);
  };

  const handleInfoButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.currentTarget.id === 'eco-contribution') {
      setInfoText(getEcoContributionDescription());
    } else {
      swapSettingOptions.map(option => {
        if (event.currentTarget.id === option.id) {
          setInfoText(option.getDescription());
        }
      });
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setInfoText('');
  };

  const handleEcoImpactSettingsClick = () => {
    setIsEcoImpactSettings(!isEcoImpactSettings);
  };

  const handleUpdateClick = () => {
    console.log('Update clicked');
  };

  const handleSelectEcoImpactType = (event: React.MouseEvent<HTMLElement>, type: string | null) => {
    if (type !== null) {
      setEcoImpactType(type);
    }
  };

  const handleChangeEcoImpactValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEcoImpactValue(event.target.value);
  };

  const handleTextFieldFocusRemoving = () => {
    if (ecoImpactType === '$' && !ecoImpactValue) {
      setEcoImpactValue('0.5');
    } else {
      if (!ecoImpactValue || Number(ecoImpactValue) > 50) {
        setEcoImpactValue('0.5');
      }
    }
  };

  const swapInfoBlock = !isSettings ? (
    <SwapSettingsInfo
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      // @ts-ignore
      toTokenSymbol={toTokenInfo?.symbol}
      infoIconStyle={styles.infoIcon}
      {...{
        slippageTolerance,
        minimumReceived,
        priceImpact,
        swapSettingOptions,
        popoverId,
        handleInfoButtonClick,
      }}
    />
  ) : (
    <SlippageToleranceSettings
      handleClose={handleSettingsClick}
      infoIconStyle={styles.infoIcon}
      {...{ slippageTolerance, setSlippageTolerance, popoverId, handleInfoButtonClick }}
    />
  );

  const ecoImpactRightSide = !isEcoImpactSettings ? (
    <Box className={styles.ecoImpactSideBlock}>
      <Typography className={styles.ecoImpactValueText}>
        {ecoImpactType + ecoImpactValue}
      </Typography>
      <IconButton
        className={styles.ecoImpactSettingsIconWrapper}
        onClick={handleEcoImpactSettingsClick}
      >
        <SettingsIcon className={styles.icon} />
      </IconButton>
    </Box>
  ) : (
    <Box className={styles.ecoImpactSideBlock}>
      <StyledTextField
        id="custom-slippage-tolerance"
        variant="outlined"
        value={ecoImpactValue}
        onChange={handleChangeEcoImpactValue}
        onBlur={handleTextFieldFocusRemoving}
        InputProps={{
          inputComponent: NumberFormatCustom as any,
        }}
      />
      <StyledToggleButtonGroup
        value={ecoImpactType}
        exclusive
        onChange={handleSelectEcoImpactType}
        aria-label="select-eco-impact-type"
        sx={{ backgroundColor: 'rgba(0, 0, 0, 1)', borderRadius: '8px' }}
      >
        <ToggleButton value="$" aria-label="0.1%">
          $
        </ToggleButton>
        <ToggleButton value="%" aria-label="0.5%">
          %
        </ToggleButton>
      </StyledToggleButtonGroup>
      <IconButton
        size="small"
        className={styles.closeEcoContributionSettingsButton}
        onClick={handleEcoImpactSettingsClick}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );

  return (
    <Box className={styles.wrapper}>
      <Box className={styles.infoHeader}>
        <Box className={styles.infoHeaderBlock}>
          <InfoLabel />
        </Box>
        <Box className={styles.infoHeaderBlock}>
          <IconButton className={styles.headerIconWrapper} onClick={handleUpdateClick}>
            <UpdateIcon fontSize="large" className={styles.icon} />
          </IconButton>
          <IconButton className={styles.headerIconWrapper} onClick={handleSettingsClick}>
            <SettingsIcon fontSize="large" className={styles.icon} />
          </IconButton>
        </Box>
      </Box>
      {swapInfoBlock}
      <Box className={styles.ecoImpactWrapper}>
        <Box className={styles.ecoImpactSideBlock}>
          <div className={styles.earthIcon}>&#127759;</div>
          <Typography className={styles.ecoImpactTitleText}>ECO - Contribution</Typography>
          <IconButton
            className={styles.infoIcon}
            size="small"
            aria-describedby={popoverId}
            onClick={handleInfoButtonClick}
            id="eco-contribution"
          >
            <InfoIcon />
          </IconButton>
        </Box>
        {ecoImpactRightSide}
      </Box>
      <StyledPopover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography className={styles.swapInfoText}>{infoText}</Typography>
      </StyledPopover>
    </Box>
  );
};

export default SwapSettingsContainer;
