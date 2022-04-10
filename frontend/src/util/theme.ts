import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#b39ddb'
    },
    secondary: {
      main: '#f48fb1'
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
