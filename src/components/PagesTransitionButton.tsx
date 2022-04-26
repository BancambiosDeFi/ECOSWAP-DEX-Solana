import React from 'react';
import { makeStyles } from '@mui/styles';
import { Box, IconButton } from '@mui/material';
import { useHistory } from 'react-router';
import { ReactComponent as ArrowLeftIcon } from '../assets/icons/arrowLeftIcon.svg';
import { ReactComponent as ArrowRightIcon } from '../assets/icons/arrowRightIcon.svg';

interface ChartProps {
  location: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '29px',
    borderRadius: '20px 0 0 20px',
    border: '1px solid #0156FF',
    boxShadow: '-11px 0px 12.0059px 12.0059px rgba(0, 0, 0, 0.5)',
    boxSizing: 'border-box',
    backgroundColor: '#0A0C0E !important',
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
