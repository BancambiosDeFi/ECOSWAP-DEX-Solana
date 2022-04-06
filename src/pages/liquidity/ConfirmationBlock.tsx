import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { makeStyles } from '@mui/styles';

import { ReactComponent as CheckedIcon } from '../../assets/icons/checkbox.svg';

const useStyles = makeStyles(() => ({
  swapInfoWrapper: {
    width: '100%',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(65, 63, 63, 1)',
    borderRadius: '20px',
    padding: '8px 16px',
    marginBottom: '20px',
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
  checkBoxWrap: {
    width: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
  },
  checkbox: {
    '&&': {
      width: '18px',
      height: '18px',
      color: '#C4C4C4',
      marginRight: '10px',
    },
  },
  checkboxChecked: {
    '&&&': {
      color: '#fff',
    },
  },
  checkboxLabel: {
    '&&': {
      marginLeft: 0,
    },
  },
  checkedIcon: {
    color: 'rgba(78, 203, 113, 1)',
    width: '100%',
    height: '100%',
    position: 'absolute',
    border: '2px solid #fff',
    borderRadius: '2px',
    padding: '2.5px',
    display: 'inline-flex',
    boxSizing: 'border-box',
    transition: 'fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  },
}));

export const ConfirmationBlock = ({
  isConfirmed = false,
  setConfirmed,
  isNotWarn = false,
  setNotWarn,
}) => {
  const styles = useStyles();

  return (
    <Box className={styles.swapInfoWrapper}>
      <Box className={styles.swapInfoLeftSide}>
        <Typography className={styles.swapInfoText}>
          I have read{' '}
          <Link href="#" underline="none">
            Bancambios Liquidity Guide
          </Link>{' '}
          and understand the risks involved with providing liquidity and impermanent loss.
        </Typography>
      </Box>
      <FormGroup className={styles.checkBoxWrap}>
        <FormControlLabel
          className={styles.checkboxLabel}
          classes={{
            label: styles.swapInfoText,
          }}
          control={
            <Checkbox
              classes={{ root: styles.checkbox, checked: styles.checkboxChecked }}
              checkedIcon={<CheckedIcon className={styles.checkedIcon} />}
              value={isConfirmed}
              onChange={({ target: { checked } }) => setConfirmed(checked)}
            />
          }
          label="Confirm"
        />
        <FormControlLabel
          className={styles.checkboxLabel}
          classes={{
            label: styles.swapInfoText,
          }}
          control={
            <Checkbox
              classes={{ root: styles.checkbox, checked: styles.checkboxChecked }}
              checkedIcon={<CheckedIcon className={styles.checkedIcon} />}
              value={isNotWarn}
              onChange={({ target: { checked } }) => setNotWarn(checked)}
            />
          }
          label="Do not warn again for this pool"
        />
      </FormGroup>
    </Box>
  );
};
