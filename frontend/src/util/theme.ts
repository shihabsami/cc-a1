import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#a68cd6'
    },
    secondary: {
      main: '#d46294'
    },
    info: {
      main: '#81c784'
    },
    error: {
      main: '#f44336'
    }
  },
  typography: {
    fontFamily: 'Quicksand',
    fontSize: 16,
    body2: {
      fontWeight: 300
    }
  }
});

export default theme;
