import React from 'react';
import { makeStyles } from '@mui/styles';
import { Box, IconButton } from '@mui/material';
import { useHistory } from 'react-router';
import StackedBarChartSharpIcon from '@mui/icons-material/StackedBarChartSharp';
import { ReactComponent as ArrowLeftIcon } from '../assets/icons/arrowLeftIcon.svg';
import { ReactComponent as ArrowRightIcon } from '../assets/icons/arrowRightIcon.svg';

interface ChartProps {
  location: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = makeStyles(theme => ({
  chartButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '29px',
    boxSizing: 'border-box',
    marginRight: '4px',
    color: '#015bb5',
  },
}));

export const PagesTransitionButton: React.FC<ChartProps> = ({ location }) => {
  const styles = useStyles();
  const history = useHistory();
  const backToPage = location === 'swap' ? '/trading-view' : '/swap';

  const handleClick = () => {
    history.push(backToPage);
  };

  const arrowIcon = <StackedBarChartSharpIcon />;

  return (
    <IconButton className={styles.chartButton} onClick={handleClick}>
      {arrowIcon}
    </IconButton>
  );
};
