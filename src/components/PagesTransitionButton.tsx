import React from 'react';
import { makeStyles } from '@mui/styles';
import { Box, IconButton } from '@mui/material';
import { useHistory } from 'react-router';
import { ReactComponent as ArrowLeftIcon } from '../assets/icons/arrowLeftIcon.svg';
import { ReactComponent as ArrowRightIcon } from '../assets/icons/arrowRightIcon.svg';

interface ChartProps {
  location: string;
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '29px',
    borderRadius: '20px 0 0 20px',
    boxShadow: '0px 0px 30px 5px rgba(0,0,0,0.075)',
    boxSizing: 'border-box',
    backgroundColor: '#35363A !important',
    marginRight: '4px',
  },
}));

export const PagesTransitionButton: React.FC<ChartProps> = ({ location }) => {
  const styles = useStyles();
  const history = useHistory();
  const backToPage = location === 'swap' ? '/trading-view' : '/swap';

  const handleClick = () => {
    history.push(backToPage);
  };

  const arrowIcon = location === 'swap' ? <ArrowLeftIcon /> : <ArrowRightIcon />;

  return (
    <Box className={styles.wrapper}>
      <IconButton onClick={handleClick}>{arrowIcon}</IconButton>
    </Box>
  );
};
