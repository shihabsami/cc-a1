import { Alert, Snackbar, SnackbarProps } from '@mui/material';
import { useEffect, useState } from 'react';

export default function MessageSnackbar({ message, open, severity, ...rest }: MessageSnackbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleErrorSnackbarClose = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    if (open) {
      setIsOpen(true);
    }
  }, [open]);

  return (
    <Snackbar open={isOpen} autoHideDuration={5000} onClose={handleErrorSnackbarClose} {...rest}>
      <Alert severity={severity} onClose={handleErrorSnackbarClose}>
        {message}
      </Alert>
    </Snackbar>
  );
}

interface MessageSnackbarProps extends SnackbarProps {
  message: string;
  open: boolean;
  severity: 'success' | 'error' | 'info' | 'warning';
}
