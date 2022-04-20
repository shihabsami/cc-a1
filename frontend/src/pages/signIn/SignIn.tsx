import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useMutation } from 'react-query';
import { AxiosError, AxiosResponse } from 'axios';
import FormField from '../../components/FormField';
import { useNavigate } from 'react-router-dom';
import { Grid, Link } from '@mui/material';
import { SignInResponseType } from '../../util/types';
import { api } from '../../util/api';
import { GlobalContext } from '../../components/GlobalContext';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const context = useContext(GlobalContext);
  const navigate = useNavigate();

  const { data, error, isSuccess, mutate } = useMutation<AxiosResponse<SignInResponseType>, AxiosError>(() =>
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
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <FormField
                name='username'
                label='Username'
                type='email'
                autoComplete='username'
                autoFocus
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
                autoComplete='current-password'
                onChange={setPassword}
                errors={error?.response?.data}
                margin='normal'
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Link href={'/signUp'} variant='body2'>
                {"Don't have an account? Sign up instead"}
              </Link>
            </Grid>
          </Grid>
          <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
