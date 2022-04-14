import { AppBar, Avatar, Badge, Box, Button, Container, Grid, Link, Toolbar } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Logo from '../logo.svg';
import { useContext } from 'react';
import { GlobalContext } from './GlobalContext';
import { styled } from '@mui/material/styles';

export default function NavBar() {
  const { user, signOut } = useContext(GlobalContext);
  const navigate = useNavigate();
  const onSignOut = () => {
    signOut();
    navigate('/');
  };

  const color = '#ffffff';
  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      borderRadius: '50%',
      width: '4px',
      // height: '4px',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
    }
  }));

  return (
    <AppBar position='sticky'>
      <Toolbar>
        <Container maxWidth='md'>
          <Grid container alignItems='center' justifyContent='space-between'>
            <Grid item>
              <Link component={RouterLink} to='/'>
                <img src={Logo} alt='CC Logo' height='44rem' />
              </Link>
            </Grid>
            <Grid item>
              {!user ? (
                <Box display={'flex'} alignItems={'center'}>
                  <Box>
                    <Button component={RouterLink} to='/signIn' color='inherit'>
                      Sign In
                    </Button>
                  </Box>
                  <Box>
                    <Button component={RouterLink} to='/signUp' color='inherit'>
                      Sign Up
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box display={'flex'} alignItems={'center'}>
                  <Box>
                    <Button onClick={onSignOut} color='inherit'>
                      Sign Out
                    </Button>
                  </Box>
                  <Box sx={{ pl: 2 }}>
                    <StyledBadge
                      overlap='circular'
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant='dot'
                    >
                      <Avatar
                        sx={{ border: `2px solid ${color}`, width: 42, height: 42 }}
                        alt='Profile Image'
                        src='https://picsum.photos/128/128'
                      />
                    </StyledBadge>
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        </Container>
      </Toolbar>
    </AppBar>
  );
}
