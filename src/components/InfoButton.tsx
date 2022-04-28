import React from 'react';
import { makeStyles } from '@mui/styles';
import { IconButton } from '@mui/material';
import { ReactComponent as InfoIcon } from '../assets/icons/info-icon.svg';

interface InfoButtonProps {
  id: string;
  popoverId: string | undefined;
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const useStyles = makeStyles(() => ({
  infoIcon: {
    width: 'fit-content !important',
    height: 'fit-content !important',
    padding: '0 !important',
    marginLeft: '8px !important',
  },
}));

const InfoButton: React.FC<InfoButtonProps> = ({ id, popoverId, handleClick }) => {
  const styles = useStyles();

  return (
    <>
      <IconButton
        className={styles.infoIcon}
        size="small"
        aria-describedby={popoverId}
        onClick={handleClick}
        id={id}
      >
        <InfoIcon />
      </IconButton>
    </>
  );
};

export default InfoButton;
