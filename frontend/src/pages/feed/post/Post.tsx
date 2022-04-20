import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography
} from '@mui/material';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { api } from '../../../util/api';
import { CommentType, PostType } from '../../../util/types';
import { useNavigate, useParams } from 'react-router-dom';
import UserAvatar from '../../../components/UserAvatar';
import moment from 'moment';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Comments from '../../../components/Comments';
import { GlobalContext } from '../../../components/GlobalContext';

export default function Post() {
  const id = useParams().id as unknown as number;
  const { user, isLoading } = useContext(GlobalContext);
  const navigate = useNavigate();

  const fetchQueryOptions = {
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  };

  const [post, setPost] = useState<PostType>();
  const { isLoading: isPostLoading, refetch: fetchPost } = useQuery(
    ['fetchPost', id],
    async ({ queryKey }) => {
      const [, postId] = queryKey;
      await api.get(`/posts/${postId}`).then((response) => {
        setPost(response.data as PostType);
      });
    },
    fetchQueryOptions
  );

  const [comments, setComments] = useState<CommentType[]>();
  const { isLoading: isCommentsLoading, refetch: fetchComments } = useQuery(
    ['fetchComments', id],
    async ({ queryKey }) => {
      const [, postId] = queryKey;
      await api
        .get('/comments', {
          params: {
            postId: postId
          }
        })
        .then((response) => {
          setComments(response.data as CommentType[]);
        });
    },
    fetchQueryOptions
  );

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [fetchComments, fetchPost]);

  return isLoading || isPostLoading || isCommentsLoading || !post || !comments ? (
    <Box sx={{ p: 4 }} display={'flex'} justifyContent={'center'}>
      <CircularProgress size={24} color='primary' />
    </Box>
  ) : (
    <Container maxWidth={'lg'} sx={{ mb: 4 }}>
      {user && (
        <Button onClick={() => navigate('/feed')} sx={{ height: '4rem' }}>
          <ArrowBackIosNewIcon fontSize={'small'} />
          <Typography variant={'body2'} color='text.primary'>
            Back to feed
          </Typography>
        </Button>
      )}
      <Grid container sx={!user ? { mt: 4 } : {}}>
        <Grid item xs={12}>
          <Card variant={'outlined'}>
            <CardHeader
              avatar={<UserAvatar user={post.user} alt={'Post User Image'} />}
              title={post.user?.firstName.concat(' ', post.user?.lastName)}
              subheader={moment(post.createdAt).fromNow()}
              sx={{
                '.MuiCardHeader-title': {
                  fontWeight: 'bold'
                }
              }}
            />
            {post.text && (
              <CardContent>
                <Typography variant='body2'>{post.text}</Typography>
              </CardContent>
            )}
            {post.image && (
              <CardMedia
                component='img'
                sx={{
                  backgroundColor: '#ffffff'
                }}
                image={post.image.url}
                alt='Post Image'
              />
            )}
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Paper variant={'outlined'} sx={{ borderTop: 0 }}>
            {comments.length > 0 ? (
              <Comments comments={comments} />
            ) : (
              <Typography variant={'body2'} sx={{ p: 3 }}>
                No comments yet.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
