import { Box, CircularProgress } from '@mui/material';

export default function CenteredCircularProgress() {
  return (
    <Box sx={{ p: 4 }} display='flex' justifyContent='center'>
      <CircularProgress size={24} color='primary' />
    </Box>
  );
}
