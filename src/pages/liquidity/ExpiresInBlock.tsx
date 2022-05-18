import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import InfoIcon from '@mui/icons-material/Info';
import { makeStyles, styled } from '@mui/styles';

const StyledPopover = styled(Popover)(() => ({
  '& .MuiPopover-paper': {
    width: 'fit-content',
    height: 'fit-content',
    maxWidth: '453px',
    padding: '8px 16px',
    backgroundColor: 'rgba(53, 54, 58, 1)',
  },
}));

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
  },
  infoIcon: {
    position: 'absolute',
    width: '17px',
    height: '17px',
    color: 'gray',
    zIndex: '2',
  },
  infoIconBackground: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '10px',
    height: '10px',
    backgroundColor: '#fff',
  },
  infoButton: {
    position: 'relative',
    width: '20px',
    height: '20px',
  },
  wrap: {
    position: 'relative',
    width: '17px',
    height: '17px',
    margin: '0 5px',
    cursor: 'pointer',
  },
  label: {
    '&&': {
      'fontFamily': 'Saira',
      'fontSize': '24px',
      'color': '#AEAEAF',
      '@media(max-width: 540px)': {
        fontSize: '16px',
      },
    },
  },
  progressDynamic: {
    '&&': {
      position: 'absolute',
      top: 0,
      zIndex: 2,
      color: 'linear-gradient(265.93deg, #0156FF 42%, #EC26F5 133.52%)',
    },
  },
  progressStatic: {
    '&&': {
      position: 'absolute',
      color: '#AEAEAF',
      top: 0,
    },
  },
  infoText: {
    '&&': {
      fontFamily: 'Saira',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: '16px',
      lineHeight: '29px',
      textAlign: 'left',
      color: '#FFFFFF',
    },
  },
}));

export const ExpiresInBlock = ({ fetchStats }) => {
  const [progress, setProgress] = useState(0);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const styles = useStyles();
  const open = Boolean(anchorEl);

  const handleInfoClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prevProgress => (prevProgress >= 100 ? 0 : prevProgress + 5.5));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      fetchStats();
    }
  }, [progress]);

  return (
    <div className={styles.root}>
      <Typography className={styles.label}>Expires in</Typography>
      <div
        className={styles.wrap}
        onClick={() => {
          setProgress(0);
          fetchStats();
        }}
      >
        <CircularProgress
          variant="determinate"
          size={17}
          value={progress}
          className={styles.progressDynamic}
        />
        <CircularProgress
          variant="determinate"
          size={17}
          value={100}
          className={styles.progressStatic}
        />
      </div>
      <IconButton
        className={styles.infoButton}
        size="small"
        onClick={handleInfoClick}
        id="eco-contribution"
      >
        <InfoIcon className={styles.infoIcon} />
        <div className={styles.infoIconBackground} />
      </IconButton>
      <StyledPopover
        id="popover"
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
        <Typography className={styles.infoText}>
          Please Note that the Displayed data will be auto-refreshed after 18 seconds. Click this
          circle to update manually.
        </Typography>
      </StyledPopover>
    </div>
  );
};
