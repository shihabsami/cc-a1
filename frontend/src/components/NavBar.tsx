import { AppBar, Badge, Box, Button, Container, Grid, Link, Toolbar } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Logo from '../logo.svg';
import { useContext } from 'react';
import { GlobalContext } from './GlobalContext';
import { styled } from '@mui/material/styles';
import UserAvatar from './UserAvatar';

export default function NavBar() {
  const { user, signOut } = useContext(GlobalContext);
  const navigate = useNavigate();
  const onSignOut = () => {
    signOut();
    navigate('/');
  };

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      borderRadius: '50%',
      width: '4px',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
    }
  }));

  return (
    <AppBar position='sticky' sx={{ height: '4rem' }}>
      <Toolbar>
        <Container maxWidth='lg'>
          <Grid container alignItems='center' justifyContent='space-between'>
            <Grid item>
              <Link component={RouterLink} to='/'>
                <img src={Logo} alt='CC Logo' height={'44rem'} />
              </Link>
            </Grid>
            <Grid item>
              {!user ? (
                <Box display={'flex'} alignItems={'center'}>
                  <Box>
                    <Button href='/signIn' color='inherit'>
                      Sign In
                    </Button>
                  </Box>
                  <Box>
                    <Button href='/signUp' color='inherit'>
                      Sign Up
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box display={'flex'} alignItems={'center'}>
                  <Button href='/feed' color='inherit'>
                    Feed
                  </Button>
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
                      <UserAvatar
                        user={user}
                        alt={'Profile Image'}
                        sx={{ border: `2px solid #ffffff`, width: 42, height: 42 }}
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
