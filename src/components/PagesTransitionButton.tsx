import React from 'react';
import { useHistory } from 'react-router';
import StackedBarChartSharpIcon from '@mui/icons-material/StackedBarChartSharp';

interface ChartProps {
  location: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars

export const PagesTransitionButton: React.FC<ChartProps> = ({ location }) => {
  const history = useHistory();
  const backToPage = location === 'swap' ? '/trading-view' : '/swap';

  const handleClick = () => {
    history.push(backToPage);
  };

  return (
    <StackedBarChartSharpIcon
      onClick={handleClick}
      sx={{ fontSize: 40, cursor: 'pointer', color: '#FFFFFF' }}
    />
  );
};
