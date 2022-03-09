import React from 'react';
import { makeStyles } from '@mui/styles';
import { Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useHistory } from 'react-router';

interface ChartProps {
  location: string;
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    position: 'absolute',
    left: 20,
    top: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '60px',
    maxWidth: '60px',
    borderRadius: theme.spacing(2.5),
    boxShadow: '0px 0px 30px 5px rgba(0,0,0,0.075)',
    boxSizing: 'border-box',
    backgroundColor: '#35363A !important',
  },
  backArrowButton: {
    color: 'rgba(196, 196, 196, 1)',
  },
}));

export const PagesTransitionButton: React.FC<ChartProps> = ({ location }) => {
  const styles = useStyles();
  const history = useHistory();
  const backToPage = location === 'swap' ? '/trade' : '/swap';

  const handleClick = () => {
    history.push(backToPage);
  };

  return (
    <Box className={styles.wrapper}>
      <IconButton onClick={handleClick}>
        <ArrowBackIcon className={styles.backArrowButton} />
      </IconButton>
    </Box>
  );
};
