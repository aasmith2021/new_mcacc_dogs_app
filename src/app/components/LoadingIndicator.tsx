'use client';

import {
  Box,
  LinearProgress,
  Typography,
} from '@mui/material';

interface LoadingIndicatorProps {
  percentOfAnimalIdsLoaded: number;
  percentOfAnimalDataLoaded: number;
}

export const LoadingIndicator = ({ percentOfAnimalIdsLoaded, percentOfAnimalDataLoaded }: LoadingIndicatorProps) => {
  return (
    <div data-testid="loading-indicator">
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px', marginBottom: '25px' }}>
        <Typography variant="h6" component="div" align="center">
          Loading Animal Ids
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="determinate" value={percentOfAnimalIdsLoaded} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary' }}
            >{`${percentOfAnimalIdsLoaded}%`}</Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
        <Typography variant="h6" component="div" align="center">
          Loading Animal Data
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="determinate" value={percentOfAnimalDataLoaded} color="secondary" />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary' }}
            >{`${percentOfAnimalDataLoaded}%`}</Typography>
          </Box>
        </Box>
      </Box>
    </div>
  );
};
