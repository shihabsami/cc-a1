import { Container, Grid, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { AxiosError, AxiosResponse } from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import CenteredCircularProgress from '../../components/CenteredCircularProgress';
import { GlobalContext } from '../../components/GlobalContext';
import { api } from '../../util/api';
import { UserProfileType } from '../../util/types';
import CountUp from 'react-countup';
import moment from 'moment';

export default function Profile() {
  const id = useParams().id as unknown as number;
  const { isContextLoading: isLoading, isSignedIn } = useContext(GlobalContext);
  const cloudfrontUrl = process.env.REACT_APP_CLOUDFRONT_URL;

  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && !isSignedIn()) {
      return navigate('/sign-in');
    }
  }, [isLoading, isSignedIn, navigate]);

  const {
    data: userData,
    isSuccess: isUserSuccess,
    isLoading: isUserLoading
  } = useQuery<AxiosResponse<UserProfileType>, AxiosError>('getUser', () => api.get(`/users/profile/${id}`));

  const [user, setUser] = useState<UserProfileType>();
  useEffect(() => {
    if (isUserSuccess && userData) {
      setUser(userData.data);
    }
  }, [isUserSuccess, userData]);

  return (
    <Container maxWidth='lg' sx={{ mt: 2 }}>
      {isLoading || isUserLoading ? (
        <CenteredCircularProgress />
      ) : (
        <Box display='flex' justifyContent='center' alignItems='center'>
          <Paper
            variant='outlined'
            component='img'
            sx={{
              height: '18rem',
              position: 'relative',
              borderColor: '#d0c3e8',
              borderRadius: '6px'
            }}
            alt='Post Image.'
            src={`${cloudfrontUrl}/${user?.image?.url}`}
          />
          <Box display='flex' flexDirection='column' justifyContent='center' ml={1} flexGrow={1}>
            <Grid container justifyContent='center' alignItems='center' flexGrow={1}>
              <Grid item xs={4}>
                <Paper
                  variant='outlined'
                  sx={{
                    m: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: '#d0c3e8'
                  }}
                >
                  <Typography variant='body2'>Posts</Typography>
                  <Typography variant='h6' fontWeight='bold'>
                    <CountUp duration={1} end={user?.posts.length || 0} />
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper
                  variant='outlined'
                  sx={{
                    m: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: '#d0c3e8'
                  }}
                >
                  <Typography variant='body2'>Likes</Typography>
                  <Typography variant='h6' fontWeight='bold'>
                    <CountUp duration={1} end={user?.posts.length || 0} />
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper
                  variant='outlined'
                  sx={{
                    m: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: '#d0c3e8'
                  }}
                >
                  <Typography variant='body2'>Comments</Typography>
                  <Typography variant='h6' fontWeight='bold'>
                    <CountUp duration={1} end={user?.posts.length || 0} />
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            <Paper variant='outlined' sx={{ m: 1, p: 1, borderColor: '#d0c3e8', height: '13rem' }}>
              <Typography variant='h4'>
                <b>{user?.firstName}</b> {user?.lastName}
              </Typography>
              <Typography variant='body2'>
                <b>Email</b> {user?.username}
              </Typography>
              <Typography variant='body2'>
                <b>Joined</b> {moment(user?.createdAt).format('MMMM Do, YYYY')}
              </Typography>
            </Paper>
          </Box>
        </Box>
      )}
    </Container>
  );
}
