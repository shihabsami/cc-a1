import { Alert, Snackbar, SnackbarProps } from '@mui/material';
import { useEffect, useState } from 'react';

export default function ErrorSnackbar({ message, open, ...rest }: ErrorSnackbarProps) {
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
      <Alert severity='error' onClose={handleErrorSnackbarClose}>
        {message}
      </Alert>
    </Snackbar>
  );
}

interface ErrorSnackbarProps extends SnackbarProps {
  message: string;
  open: boolean;
}
