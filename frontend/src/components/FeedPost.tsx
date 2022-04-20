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
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import ShareIcon from '@mui/icons-material/Share';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { CommentType, LikeType, PostType } from '../util/types';
import { GlobalContext } from './GlobalContext';
import { api } from '../util/api';
import Collapse from '@mui/material/Collapse';
import RateReviewTwoToneIcon from '@mui/icons-material/RateReviewTwoTone';
import DoneAllTwoToneIcon from '@mui/icons-material/DoneAllTwoTone';
import { useQuery, useQueryClient } from 'react-query';
import {
  FacebookIcon,
  FacebookShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton
} from 'react-share';
import ExpandLessTwoToneIcon from '@mui/icons-material/ExpandLessTwoTone';
import Comments from './Comments';
import moment from 'moment';
import UserAvatar from './UserAvatar';
import Link from '@mui/material/Link';

interface FeedPostProps extends CardProps {
  post: PostType;
}

export default function FeedPost({ post, ...rest }: FeedPostProps) {
  const { user } = useContext(GlobalContext);
  const client = useQueryClient();
  const userFullName = post.user.firstName.concat(' ', post.user.lastName);

  const [likes, setLikes] = useState<LikeType[]>();
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
          const likesResponse = response.data as LikeType[];
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

  const [comments, setComments] = useState<CommentType[]>();
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
          setComments(response.data as CommentType[]);
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

  const shareTitle = post.text ? `"${post.text}"` : `Check out this post on CC A1 by ${userFullName}.`;
  const shareUrl = `${window.location.href}/${post.id}`;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const shareOpen = Boolean(anchorEl);
  const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleShareClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    fetchLikes();
    fetchComments();
  }, [fetchLikes, fetchComments]);

  return (
    <>
      <Card {...rest} variant={'outlined'} sx={{ mt: '2rem' }}>
        <CardHeader
          avatar={<UserAvatar user={post.user} alt={'Post User Image'} />}
          title={userFullName}
          subheader={moment(post.createdAt).fromNow()}
          sx={{
            '.MuiCardHeader-title': {
              fontWeight: 'bold'
            }
          }}
        />
        {post.text && (
          <Link href={`/feed/${post.id}`} underline={'none'} color={'inherit'}>
            <CardContent>
              <Typography variant='body2'>{post.text}</Typography>
            </CardContent>
          </Link>
        )}
        {post.image && (
          <Link href={`/feed/${post.id}`}>
            <CardMedia
              component='img'
              sx={{
                backgroundColor: '#ffffff'
              }}
              image={post.image.url}
              alt='Post Image'
            />
          </Link>
        )}
        <CardActions disableSpacing sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
          {isLikesLoading ? (
            <Button fullWidth disabled>
              {liked ? <ThumbUpAltIcon sx={{ pr: 1 }} color={'primary'} /> : <ThumbUpOffAltIcon sx={{ pr: 1 }} />}
              <CircularProgress size={'1rem'} color='primary' />
            </Button>
          ) : (
            <Button fullWidth onClick={() => onLike()}>
              {liked ? <ThumbUpAltIcon color={'primary'} /> : <ThumbUpOffAltIcon />}
              <Typography sx={{ width: '1rem', pl: 1 }}>{likes?.length}</Typography>
            </Button>
          )}
          {isCommentsLoading ? (
            <Button fullWidth disabled>
              <InsertCommentIcon sx={{ pr: 1 }} />
              <CircularProgress size={'1rem'} color='primary' />
            </Button>
          ) : (
            <Button fullWidth onClick={() => setCommentsOpen((prevState) => !prevState)}>
              {commentsOpen ? <ExpandLessTwoToneIcon /> : <InsertCommentIcon />}
              <Typography sx={{ width: '1rem', pl: 1 }}>{comments?.length}</Typography>
            </Button>
          )}
          <Button fullWidth onClick={handleShareClick}>
            <ShareIcon />
          </Button>
          <Menu anchorEl={anchorEl} open={shareOpen} onClose={handleShareClose} disableScrollLock>
            <MenuItem onClick={handleShareClose}>
              <FacebookShareButton style={{ display: 'inline-flex' }} url={shareUrl} title={shareTitle}>
                <FacebookIcon size={32} round />
                <Typography sx={{ pl: 1 }}>Facebook</Typography>
              </FacebookShareButton>
            </MenuItem>
            <MenuItem onClick={handleShareClose}>
              <TwitterShareButton style={{ display: 'inline-flex' }} url={shareUrl} title={shareTitle}>
                <TwitterIcon size={32} round />
                <Typography sx={{ pl: 1 }}>Twitter</Typography>
              </TwitterShareButton>
            </MenuItem>
            <MenuItem onClick={handleShareClose}>
              <RedditShareButton style={{ display: 'inline-flex' }} url={shareUrl} title={shareTitle}>
                <RedditIcon size={32} round />
                <Typography sx={{ pl: 1 }}>Reddit</Typography>
              </RedditShareButton>
            </MenuItem>
          </Menu>
        </CardActions>
      </Card>
      <Collapse in={commentsOpen}>
        <Paper variant={'outlined'} style={{ border: '1px #e0e0e0 solid', borderTop: 0 }}>
          <Box display={'flex'} p={2} alignItems={'center'}>
            <Avatar sx={{ bgcolor: '#c4c4c4' }}>
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
          {comments?.length != 0 && <Divider />}
          {isCommentsLoading ? <CircularProgress size={24} color='primary' /> : <Comments comments={comments} />}
        </Paper>
      </Collapse>
    </>
  );
}
