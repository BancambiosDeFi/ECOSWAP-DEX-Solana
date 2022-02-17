import React, { useState } from 'react';
import { makeStyles, styled } from '@mui/styles';
import {
  Box,
  IconButton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NumberFormat from 'react-number-format';
import { ReactComponent as InfoIcon } from '../../../assets/icons/info-icon.svg';

interface SlippageToleranceProps {
  handleClose: () => void;
  slippageTolerance: string;
  setSlippageTolerance: React.Dispatch<React.SetStateAction<string>>;
  popoverId: string | undefined;
  handleInfoButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  infoIconStyle: string;
}

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const useStyles = makeStyles(theme => ({
  slippageToleranceSettingWrapper: {
    width: '100%',
    height: 'fit-content',
    minHeight: '132px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(65, 63, 63, 1)',
    borderRadius: '20px',
    padding: '16px 17px 27px 17px',
    marginBottom: '10px',
  },
  closeButton: {
    right: '8px',
    top: '4px',
    color: '#FFFFFF !important',
  },
  rowBlock: {
    width: 'fit-content',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'Saira !important',
    fontStyle: 'normal',
    fontWeight: '800 !important',
    fontSize: '16px !important',
    lineHeight: '40px !important',
    textAlign: 'left',
    color: '#FFFFFF',
  },
  bodyText: {
    fontFamily: 'Saira !important',
    fontStyle: 'normal',
    fontWeight: '400 !important',
    fontSize: '16px !important',
    lineHeight: '29px !important',
    textAlign: 'left',
    color: '#FFFFFF',
  },
  percentBlock: {
    width: 'fit-content',
    height: '37px',
    borderRadius: theme.spacing(1),
    marginRight: '32px',
  },
  customText: {
    fontFamily: 'Saira !important',
    fontStyle: 'normal',
    fontWeight: '600 !important',
    fontSize: '12px !important',
    lineHeight: '19px !important',
    textAlign: 'left',
    color: '#FFFFFF',
  },
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    'width': 'fit-content',
    'height': '37px',
    'minWidth': '37px',
    'border': '2px solid transparent',
    'color': '#FFFFFF',
    'padding': 0,
    'marginRight': theme.spacing(2.5),
    '&.Mui-disabled': {
      border: 0,
    },
    '&.Mui-selected': {
      background:
        'linear-gradient(#1E2022, #1E2022) padding-box, linear-gradient(to right, rgba(236, 38, 245, 1), rgba(1, 86, 255, 1)) border-box',
      borderRadius: '8px',
      border: '2px solid transparent',
      color: '#FFFFFF',
    },
    '&:not(:first-of-type)': {
      borderRadius: '8px !important',
    },
    '&:first-of-type': {
      borderRadius: '8px !important',
    },
    '&:not(:last-of-type)': {
      padding: '0 6px',
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
  '& .MuiInput-underline:after': {
    borderBottomColor: 'rgb(183,82,230)',
  },
  '& .MuiOutlinedInput-root': {
    'width': '57px',
    'height': '29px',
    'borderRadius': '8px',
    'marginLeft': '9px',
    'marginRight': '5px',
    'border': '2px solid transparent',
    '& fieldset': {
      zIndex: 0,
      backgroundColor: '#1E2022',
    },
    '&:hover': {
      background:
        'linear-gradient(#1E2022, #1E2022) padding-box, linear-gradient(to right, rgba(236, 38, 245, 1), rgba(1, 86, 255, 1)) border-box',
      borderRadius: '8px',
      border: '2px solid transparent',
    },
    '&.Mui-focused': {
      background:
        'linear-gradient(#1E2022, #1E2022) padding-box, linear-gradient(to right, rgba(236, 38, 245, 1), rgba(1, 86, 255, 1)) border-box',
      borderRadius: '8px',
      border: '2px solid transparent',
    },
  },
});

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

const SlippageToleranceSettings: React.FC<SlippageToleranceProps> = ({
  handleClose,
  slippageTolerance,
  setSlippageTolerance,
  popoverId,
  handleInfoButtonClick,
  infoIconStyle,
}) => {
  const styles = useStyles();
  const [customValue, setCustomValue] = useState<string>(
    slippageTolerance === '0.1' || slippageTolerance === '0.5' || slippageTolerance === '1'
      ? ''
      : slippageTolerance,
  );

  const handleSelectPercent = (event: React.MouseEvent<HTMLElement>, percent: string | null) => {
    if (percent !== null) {
      setSlippageTolerance(percent);
    }
  };

  const handleCustomField = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomValue(event.target.value);
  };

  const handleFocusRemoving = () => {
    if (!customValue || Number(customValue) > 50) {
      setCustomValue('');
      setSlippageTolerance('0.1');
    } else {
      setSlippageTolerance(customValue);
    }
  };

  return (
    <Box className={styles.slippageToleranceSettingWrapper}>
      <IconButton
        size="small"
        className={styles.closeButton}
        sx={{ position: 'absolute' }}
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      <Box className={styles.rowBlock}>
        <Typography className={styles.titleText}>Slippage Tolerance</Typography>
        <IconButton
          className={infoIconStyle}
          size="small"
          aria-describedby={popoverId}
          onClick={handleInfoButtonClick}
          id="slippage-tolerance"
        >
          <InfoIcon />
        </IconButton>
      </Box>
      <Box className={styles.rowBlock}>
        <StyledToggleButtonGroup
          value={slippageTolerance}
          exclusive
          onChange={handleSelectPercent}
          aria-label="select-slippage-tolerance-percent"
        >
          <ToggleButton value="0.1" aria-label="0.1%">
            0.1%
          </ToggleButton>
          <ToggleButton value="0.5" aria-label="0.5%">
            0.5%
          </ToggleButton>
          <ToggleButton value="1" aria-label="1%">
            1%
          </ToggleButton>
        </StyledToggleButtonGroup>
        <Typography className={styles.customText}>Custom:</Typography>
        <StyledTextField
          id="custom-slippage-tolerance"
          variant="outlined"
          value={customValue}
          defaultValue={customValue}
          onChange={handleCustomField}
          onBlur={handleFocusRemoving}
          InputProps={{
            inputComponent: NumberFormatCustom as any,
          }}
        />
        <Typography className={styles.customText}>%</Typography>
      </Box>
    </Box>
  );
};

export default SlippageToleranceSettings;
