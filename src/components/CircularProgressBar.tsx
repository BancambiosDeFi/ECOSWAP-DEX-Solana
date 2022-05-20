import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress, {
  circularProgressClasses,
  CircularProgressProps,
} from '@mui/material/CircularProgress';

const CircularProgressBar: React.FC<CircularProgressProps> = props => {
  return (
    <Box sx={{ position: 'relative', display: 'flex', cursor: 'pointer' }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: 'rgba(174, 174, 175, 1)',
        }}
        size={17}
        thickness={7}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="determinate"
        sx={{
          color: 'rgba(1, 86, 255, 1)',
          animationDuration: '550ms',
          position: 'absolute',
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round',
          },
        }}
        size={17}
        thickness={7}
        {...props}
      />
    </Box>
  );
};

export default CircularProgressBar;
