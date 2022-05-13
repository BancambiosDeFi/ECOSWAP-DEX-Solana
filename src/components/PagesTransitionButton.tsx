import { useHistory } from 'react-router';
import { makeStyles } from '@mui/styles';
import { ReactComponent as ChartOpen } from '../assets/icons/iconOpenChart.svg';

interface ChartProps {
  location: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = makeStyles(theme => ({
  iconButtonChart: {
    cursor: 'pointer',
  },
}));

export const PagesTransitionButton: React.FC<ChartProps> = ({ location }) => {
  const history = useHistory();
  const classes = useStyles();
  const backToPage = location === 'swap' ? '/trading-view' : '/swap';

  const handleClick = () => {
    history.push(backToPage);
  };

  return <ChartOpen onClick={handleClick} className={classes.iconButtonChart} />;
};
