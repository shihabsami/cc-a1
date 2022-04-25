import { useContext, useEffect, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { Button, Card, CardContent, CardHeader, CardMedia, Container, Grid, Paper, Typography } from '@mui/material';
import { ArrowBackIosNew } from '@mui/icons-material';
import { GlobalContext } from '../../../components/GlobalContext';
import { CommentType, PostType } from '../../../util/types';
import { api } from '../../../util/api';
import UserAvatar from '../../../components/UserAvatar';
import Comments from '../../../components/Comments';
import MessageSnackbar from '../../../components/MessageSnackbar';
import CenteredCircularProgress from '../../../components/CenteredCircularProgress';

export default function Post() {
  const id = useParams().id as unknown as number;
  const { user, isContextLoading: isLoading } = useContext(GlobalContext);
  const navigate = useNavigate();
  const cloudfrontUrl = process.env.REACT_APP_CLOUDFRONT_URL;

  const [post, setPost] = useState<PostType>();
  const {
    data: postData,
    isSuccess: isPostSuccess,
    isLoading: isPostLoading,
    isError: isPostError
  } = useQuery<AxiosResponse<PostType>, AxiosError>(['fetchPost', id], ({ queryKey }) => {
    const [, id] = queryKey;
    return api.get(`/posts/${id}`);
  });
  useEffect(() => {
    if (isPostSuccess && postData) {
      setPost(postData.data);
    }
  }, [isPostSuccess, postData, postData?.data]);

  const [comments, setComments] = useState<CommentType[]>();
  const {
    data: commentsData,
    isSuccess: isCommentsSuccess,
    isLoading: isCommentsLoading,
    isError: isCommentsError
  } = useQuery<AxiosResponse<CommentType[]>, AxiosError>(['fetchComments', id], ({ queryKey }) => {
    const [, id] = queryKey;
    return api.get('/comments', {
      params: {
        postId: id
      }
    });
  });
  useEffect(() => {
    if (isCommentsSuccess && commentsData) {
      setComments(commentsData.data);
    }
  }, [isCommentsSuccess, commentsData, commentsData?.data]);

  return isLoading || isPostLoading || isCommentsLoading || !post || !comments ? (
    <CenteredCircularProgress />
  ) : (
    <Container maxWidth='lg' sx={{ mb: 4 }}>
      {user && (
        <Button onClick={() => navigate('/feed')} sx={{ height: '4rem' }}>
          <ArrowBackIosNew fontSize='small' />
          <Typography variant='body2' color='text.primary'>
            Back to feed
          </Typography>
        </Button>
      )}
      <Grid container sx={!user ? { mt: 4 } : {}}>
        <Grid item xs={12}>
          <Card variant='outlined' sx={{ borderColor: '#d0c3e8' }}>
            <CardHeader
              avatar={<UserAvatar user={post.user} alt='Post User Image' />}
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
                image={`${cloudfrontUrl}/${post.image.url}`}
                alt='Post Image'
              />
            )}
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Paper variant='outlined' sx={{ borderTop: 0 }}>
            {comments.length > 0 ? (
              <Comments comments={comments} />
            ) : (
              <Typography variant='body2' sx={{ p: 2 }}>
                No comments yet.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
      <MessageSnackbar open={isPostError} message='Could not load post. Please try again.' severity={'error'} />
      <MessageSnackbar open={isCommentsError} message='Could not load comments. Please try again.' severity={'error'} />
    </Container>
  );
}
