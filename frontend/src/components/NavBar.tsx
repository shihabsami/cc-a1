import { AppBar, Box, Button, Container, Grid, Link, Toolbar } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Logo from '../logo.svg';
import { useContext } from 'react';
import { GlobalContext } from './GlobalContext';

export default function NavBar() {
  const { user, signOut } = useContext(GlobalContext);
  const navigate = useNavigate();
  const onSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <Container maxWidth='md'>
            <Grid container justifyContent='space-between'>
              <Grid item>
                <Link component={RouterLink} to='/'>
                  <img src={Logo} alt='CC Logo' height='44rem' />
                </Link>
              </Grid>
              <Grid item>
                {!user ? (
                  <>
                    <Button component={RouterLink} to='/signIn' color='inherit'>
                      Sign In
                    </Button>
                    <Button component={RouterLink} to='/signUp' color='inherit'>
                      Sign Up
                    </Button>
                  </>
                ) : (
                  <Button onClick={onSignOut} color='inherit'>
                    Sign Out
                  </Button>
                )}
              </Grid>
            </Grid>
          </Container>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
