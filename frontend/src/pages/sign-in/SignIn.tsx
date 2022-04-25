import { useContext, useEffect, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Container, Grid, Link, Typography } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { GlobalContext } from '../../components/GlobalContext';
import { SignInResponseType } from '../../util/types';
import { api } from '../../util/api';
import FormField from '../../components/FormField';
import MessageSnackbar from '../../components/MessageSnackbar';
import LoadingButton from '../../components/LoadingButton';

export default function SignIn() {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const context = useContext(GlobalContext);
  const navigate = useNavigate();

  const { data, isSuccess, isLoading, error, isError, mutate } = useMutation<
    AxiosResponse<SignInResponseType>,
    AxiosError
  >(() =>
    api.post('/users/authenticate', {
      username: username,
      password: password
    })
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate();
  };

  useEffect(() => {
    if (isSuccess && data) {
      context.signIn(data.data);
      return navigate('/feed');
    }
  }, [isSuccess, data, context, navigate]);

  return (
    <Container maxWidth='xs'>
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlined />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 4 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <FormField
                name='username'
                label='Email'
                type='email'
                autoComplete='email'
                autoFocus
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
                autoComplete='current-password'
                onChange={setPassword}
                errors={error?.response?.data}
                required
              />
            </Grid>
          </Grid>
          <LoadingButton loading={isLoading} type='submit' fullWidth variant='contained' sx={{ mt: 1, mb: 2 }}>
            Sign In
          </LoadingButton>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Link href='/sign-up' variant='body2'>
                Don&apos;t have an account? Sign up instead
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <MessageSnackbar open={isError} message='Sign in failed. Please try again.' severity={'error'} />
    </Container>
  );
}
