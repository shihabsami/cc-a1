import React from 'react';
import { Button, ButtonProps, CircularProgress, ThemeProvider } from '@mui/material';
import theme from '../util/theme';

const customTheme = theme;
customTheme.palette.action.disabledBackground = '#f0eef3';

function LoadingButton({ loading, ...rest }: LoadingButtonProps) {
  return (
    <ThemeProvider theme={customTheme}>
      <Button disabled={loading} {...rest}>
        {loading ? <CircularProgress size={24} color='primary' /> : rest.children}
      </Button>
    </ThemeProvider>
  );
}

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}

export default LoadingButton;
