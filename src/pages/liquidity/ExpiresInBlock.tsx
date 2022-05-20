import React, { useState } from 'react';
import { IconButton, Typography, Popover } from '@mui/material';
import { makeStyles, styled } from '@mui/styles';
import CircularProgressBar from '../../components/CircularProgressBar';
import { ReactComponent as ExpiresInfoIcon } from '../../assets/icons/expires-info-icon.svg';

const useStyles = makeStyles(() => ({
  expiresInContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expiresInText: {
    fontSize: '24px',
    color: '#AEAEAF',
    marginRight: '4px !important',
  },
  title: {
    'fontFamily': 'Saira',
    'fontSize': '24px',
    'fontStyle': 'normal',
    'fontWeight': '400',
    'lineHeight': '34px',
    'letterSpacing': '0em',
    'textAlign': 'left',
    'marginBottom': '0px',
    '@media(max-width: 540px)': {
      fontSize: '16px ',
    },
  },
  expiresInfoButton: {
    width: 'fit-content !important',
    height: 'fit-content !important',
    padding: '0 !important',
    marginLeft: '4px !important',
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
}));

const StyledPopover = styled(Popover)(() => ({
  '& .MuiPopover-paper': {
    width: 'fit-content',
    height: 'fit-content',
    maxWidth: '453px',
    padding: '8px 16px',
    backgroundColor: 'rgba(53, 54, 58, 1)',
  },
}));

export const ExpiresInBlock = ({ seconds, infoText, updateTimer }) => {
  const styles = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const popoverId = open ? 'simple-popover' : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleInfoButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <div className={styles.expiresInContainer}>
        <Typography variant="inherit" className={`${styles.title} ${styles.expiresInText}`}>
          Expires in
        </Typography>
        <CircularProgressBar onClick={updateTimer} value={seconds * 2} />
        <IconButton
          className={styles.expiresInfoButton}
          size="small"
          aria-describedby={popoverId}
          onClick={handleInfoButtonClick}
          id="expires-in"
        >
          <ExpiresInfoIcon />
        </IconButton>
        <StyledPopover
          id={popoverId}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
        >
          <Typography variant="inherit" className={styles.swapInfoText}>
            {infoText}
          </Typography>
        </StyledPopover>
      </div>
    </>
  );
};
