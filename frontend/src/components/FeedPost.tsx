import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  CardProps,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import ShareIcon from '@mui/icons-material/Share';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Comment, Like, Post } from '../util/types';
import { GlobalContext } from './GlobalContext';
import { api } from '../util/api';
import Collapse from '@mui/material/Collapse';
import RateReviewTwoToneIcon from '@mui/icons-material/RateReviewTwoTone';
import DoneAllTwoToneIcon from '@mui/icons-material/DoneAllTwoTone';
import { useQuery, useQueryClient } from 'react-query';
import moment from 'moment';

export interface PostProps extends CardProps {
  post: Post;
}

export default function FeedPost({ post, ...rest }: PostProps) {
  const { user } = useContext(GlobalContext);
  const client = useQueryClient();

  const [likes, setLikes] = useState<Like[]>();
  const [liked, setLiked] = useState<boolean>();
  const onLike = () => {
    api
      .post(`/likes/${liked ? 'remove' : 'add'}`, null, {
        params: {
          postId: post.id
        }
      })
      .then(() => {
        fetchLikes();
      });
  };
  const { isLoading: isLikesLoading, refetch: fetchLikes } = useQuery(
    ['fetchLikes', post.id],
    async ({ queryKey }) => {
      const [, postId] = queryKey;
      await api
        .get('/likes', {
          params: {
            postId: postId
          }
        })
        .then((response) => {
          const likesResponse = response.data as Like[];
          setLiked(() => likesResponse.some((like) => user?.id == like.user.id));
          setLikes(likesResponse);
        });
    },
    {
      retry: false,
      refetchInterval: 5000,
      refetchIntervalInBackground: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false
    }
  );

  const [comments, setComments] = useState<Comment[]>();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState('');

  const { isLoading: isCommentsLoading, refetch: fetchComments } = useQuery(
    ['fetchComments', post.id],
    async ({ queryKey }) => {
      const [, postId] = queryKey;
      await api
        .get('/comments', {
          params: {
            postId: postId
          }
        })
        .then((response) => {
          setComments(response.data as Comment[]);
        });
    },
    {
      retry: false,
      refetchInterval: 5000,
      refetchIntervalInBackground: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false
    }
  );
  useEffect(() => {
    fetchLikes();
    fetchComments();
  }, [fetchLikes, fetchComments]);

  const postComment = () => {
    if (commentText) {
      api
        .post('/comments/add', null, {
          params: {
            text: commentText,
            postId: post.id
          }
        })
        .then(() => {
          setCommentText('');
          client.invalidateQueries('fetchComments');
        });
    }
  };

  return (
    <div>
      <Card {...rest} variant={'outlined'} sx={{ mt: '2rem' }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label='recipe'>
              R
            </Avatar>
          }
          action={
            <IconButton aria-label='settings'>
              <MoreVertIcon />
            </IconButton>
          }
          title={post.text}
          subheader='September 14, 2016'
        />
        <CardContent>
          <Typography variant='body2' color='text.secondary'>
            This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup
            of frozen peas along with the mussels, if you like.
          </Typography>
        </CardContent>
        <CardMedia
          component='img'
          sx={{
            backgroundColor: '#ff0000'
          }}
          image={`https://picsum.photos/512/512`}
          alt='Paella dish'
        />
        <CardActions disableSpacing sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
          {isLikesLoading ? (
            <CircularProgress size={24} color='primary' />
          ) : (
            <Button fullWidth onClick={() => onLike()}>
              {liked ? <ThumbUpAltIcon color={'primary'} /> : <ThumbUpOffAltIcon />}
              <Typography sx={{ width: '1rem', pl: 1 }}>{likes?.length}</Typography>
            </Button>
          )}
          <Button fullWidth onClick={() => setCommentsOpen((prevState) => !prevState)}>
            <InsertCommentIcon />
            <Typography sx={{ width: '1rem', pl: 1 }}>{comments?.length}</Typography>
          </Button>
          <Button fullWidth>
            <ShareIcon />
          </Button>
        </CardActions>
      </Card>
      <Collapse in={commentsOpen}>
        <Paper variant={'outlined'} style={{ border: '1px #e0e0e0 solid', borderTop: '0px' }}>
          <Box display={'flex'} p={2} alignItems={'center'}>
            <Avatar sx={{ bgcolor: '#b39ddb' }}>
              <RateReviewTwoToneIcon />
            </Avatar>
            <TextField
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  postComment();
                }
              }}
              onChange={(event) => {
                setCommentText(event.target.value);
              }}
              variant='standard'
              fullWidth
              value={commentText}
              placeholder={comments?.length == 0 ? 'Be the first to comment.' : 'Write your comment.'}
              sx={{ pl: 2, pr: 1 }}
            />
            <IconButton onClick={() => postComment()}>
              <DoneAllTwoToneIcon />
            </IconButton>
          </Box>
          <Divider />
          {isCommentsLoading ? (
            <CircularProgress size={24} color='primary' />
          ) : (
            comments &&
            comments.map((c, i) => {
              return (
                <Box key={c.id}>
                  <Box display={'flex'} p={2} alignItems={'center'}>
                    <Avatar sx={{ bgcolor: red[500] }}>R</Avatar>
                    <Box sx={{ pl: 2 }}>
                      <Box display={'inline-flex'}>
                        <Typography sx={{ pr: 1 }} fontWeight={'bold'} variant={'body2'}>
                          {c.user.firstName.concat(' ', c.user.lastName)}
                        </Typography>
                        <Typography variant={'body2'} color={'gray'}>
                          {moment(c.createdAt).fromNow()}
                        </Typography>
                      </Box>
                      <Typography variant={'body1'}>{c.text}</Typography>
                    </Box>
                  </Box>
                  {i < comments.length - 1 && <Divider />}
                </Box>
              );
            })
          )}
        </Paper>
      </Collapse>
    </div>
  );
}
