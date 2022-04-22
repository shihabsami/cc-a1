import { useContext, useEffect, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Button, Container, Grid, Link, Typography } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { GlobalContext } from '../../components/GlobalContext';
import { RoleType, SignInResponseType } from '../../util/types';
import { api } from '../../util/api';
import FormField from '../../components/FormField';
import ErrorSnackbar from '../../components/ErrorSnackbar';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const passwordsMatchingError = password && password !== confirmPassword && 'Passwords must match.';
  const context = useContext(GlobalContext);
  const navigate = useNavigate();

  const { data, isSuccess, error, isError, mutate } = useMutation<AxiosResponse<SignInResponseType>, AxiosError>(() =>
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
      return navigate('/upload-user-image');
    }
  }, [context, data, isSuccess, navigate]);

  return (
    <Container maxWidth='xs'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlined />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Register
        </Typography>
        <Box component='form' noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Grid container>
            <Grid item xs={6} sx={{ pr: 1 }}>
              <FormField
                name='firstName'
                label='First Name'
                type='text'
                autoComplete='given-name'
                autoFocus
                onChange={setFirstName}
                errors={error?.response?.data}
                required
              />
            </Grid>
            <Grid item xs={6} sx={{ pl: 1 }}>
              <FormField
                name='lastName'
                label='Last Name'
                type='text'
                autoComplete='family-name'
                onChange={setLastName}
                errors={error?.response?.data}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormField
                name='username'
                label='Email'
                type='email'
                autoComplete='email'
                onChange={setUsername}
                errors={error?.response?.data}
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
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormField
                name='confirmPassword'
                label='Confirm Password'
                type='password'
                onChange={setConfirmPassword}
                errors={
                  passwordsMatchingError
                    ? {
                        confirmPassword: passwordsMatchingError
                      }
                    : undefined
                }
                required
              />
            </Grid>
          </Grid>
          <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Link href='/sign-in' variant='body2'>
                Already have an account? Sign in instead
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <ErrorSnackbar open={isError} message='Sign up failed. Please try again.' />
    </Container>
  );
}
