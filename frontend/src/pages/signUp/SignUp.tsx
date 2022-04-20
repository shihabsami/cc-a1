import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useMutation } from 'react-query';
import FormField from '../../components/FormField';
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom';
import { Link } from '@mui/material';
import { RoleType, SignInResponseType } from '../../util/types';
import { api } from '../../util/api';
import { AxiosError, AxiosResponse } from 'axios';
import { GlobalContext } from '../../components/GlobalContext';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const passwordsMatchingError = password && password !== confirmPassword && 'Passwords must match.';
  const context = useContext(GlobalContext);
  const navigate = useNavigate();

  const { data, error, isSuccess, mutate } = useMutation<AxiosResponse<SignInResponseType>, AxiosError>(() =>
    api.post('/users/register', {
      username,
      firstName,
      lastName,
      password,
      role: RoleType.ROLE_USER
    })
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate();
  };

  useEffect(() => {
    if (isSuccess && data) {
      context.signIn(data.data);
      return navigate('/uploadProfileImage');
    }
  }, [context, data, isSuccess, navigate]);

  return (
    <Container component='div' maxWidth='xs'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <AccountCircleIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Register
        </Typography>
        <Box component='form' noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <FormField
                name='firstName'
                label='First Name'
                type='text'
                autoComplete='firstName'
                autoFocus
                onChange={setFirstName}
                errors={error?.response?.data}
                margin='normal'
                required
              />
            </Grid>
            <Grid item xs={6}>
              <FormField
                name='lastName'
                label='Last Name'
                type='text'
                autoComplete='lastName'
                onChange={setLastName}
                errors={error?.response?.data}
                margin='normal'
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormField
                name='username'
                label='Email'
                type='email'
                autoComplete='username'
                onChange={setUsername}
                errors={error?.response?.data}
                margin='normal'
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormField
                name='password'
                label='Password'
                type='password'
                autoComplete='new-password'
                onChange={setPassword}
                errors={error?.response?.data}
                margin='normal'
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormField
                name='confirmPassword'
                label='Confirm Password'
                type='password'
                autoComplete='confirm-password'
                onChange={setConfirmPassword}
                errors={
                  passwordsMatchingError
                    ? {
                        confirmPassword: passwordsMatchingError
                      }
                    : undefined
                }
                margin='normal'
                required
                fullWidth
              />
            </Grid>
          </Grid>
          <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Link component={ReactRouterLink} to='/signIn' variant='body2'>
                Already have an account? Sign in instead
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
