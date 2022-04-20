import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation, useQuery } from 'react-query';
import { api } from '../../util/api';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LoadingButton from '../../components/LoadingButton';
import { FetchPostsType, PostType } from '../../util/types';
import InfiniteScroll from 'react-infinite-scroll-component';
import Link from '@mui/material/Link';
import FeedPost from '../../components/FeedPost';
import { GlobalContext } from '../../components/GlobalContext';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';
import { acceptedImageTypes } from '../../util/constants';

type FeedState = {
  posts: PostType[];
  page: number;
  hasMore: boolean;
};

type PostState = {
  text?: string;
  image?: File;
  formOpen: boolean;
};

const initialFeedState: FeedState = {
  posts: [],
  page: -1,
  hasMore: true
};

export default function Feed() {
  const { user, isLoading, isSignedIn } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [feedState, setFeedState] = useState<FeedState>(initialFeedState);
  const [postState, setPostState] = useState<PostState>({ formOpen: false });

  const handlePostFormOpen = () => {
    setPostState({
      text: postState.text,
      image: postState.image,
      formOpen: true
    });
  };

  const handlePostFormClose = () => {
    if (!isPostLoading) {
      setPostState({
        text: undefined,
        image: undefined,
        formOpen: false
      });
    }
  };

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    if (file && acceptedImageTypes.includes(file.type)) {
      setPostState({
        text: postState.text,
        image: file,
        formOpen: postState.formOpen
      });
    } else {
      !postState.image &&
        setPostState({
          text: postState.text,
          image: undefined,
          formOpen: postState.formOpen
        });
    }
  };

  const {
    isLoading: isPostLoading,
    isSuccess: isPostSuccess,
    mutate: mutatePost
  } = useMutation(async () => {
    if (!postState.text && !postState.image) return;

    const formData = new FormData();
    formData.append('text', postState.text || '');
    let response;
    if (postState.image) {
      formData.append('image', postState.image);
      response = await api.post('/posts/saveWithImage', formData, {
        headers: { 'Content-Type': `multipart/form-data` }
      });
    } else {
      response = await api.post('/posts/save', formData);
    }

    setFeedState(initialFeedState);
    await fetchFeed();
    return response;
  });

  const fetchMorePosts = async () => {
    const nextPage = feedState.page + 1;
    await api
      .get('/posts', {
        params: {
          page: nextPage
        }
      })
      .then(async (response) => {
        const postsData = response.data as FetchPostsType;
        const updatedPosts = {
          posts: feedState.posts.concat(postsData.posts),
          page: nextPage,
          hasMore: postsData.hasMore
        };
        setFeedState(updatedPosts);
      });
  };

  const { isFetching: isFeedLoading, refetch: fetchFeed } = useQuery('fetchFeed', fetchMorePosts, {
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutatePost();
  };

  useEffect(() => {
    if (isPostSuccess) {
      setPostState({
        text: undefined,
        image: undefined,
        formOpen: false
      });
    }
  }, [isPostSuccess]);

  useEffect(() => {
    if (!isLoading && !isSignedIn()) {
      return navigate('/signIn');
    }
  }, [isLoading, isSignedIn, navigate]);

  return (
    <>
      <Container maxWidth='sm'>
        <Box sx={{ display: 'flex', mt: 3 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Button
              onClick={handlePostFormOpen}
              variant='outlined'
              fullWidth
              sx={{ height: '100%', textAlign: 'left' }}
            >
              <Typography color='text.primary' variant='body1' textTransform={'none'}>
                {user?.firstName}, what&apos;s on your mind?
              </Typography>
            </Button>
          </Box>
          <Box sx={{ pl: 2 }}>
            <Button onClick={handlePostFormOpen} variant='contained' fullWidth sx={{ height: '100%' }}>
              <RateReviewIcon />
            </Button>
          </Box>
        </Box>
        <Divider sx={{ pt: 4 }} />

        {isFeedLoading ? (
          <Box sx={{ p: 4 }} display={'flex'} justifyContent={'center'}>
            <CircularProgress size={24} color='primary' />
          </Box>
        ) : (
          <InfiniteScroll
            next={fetchMorePosts}
            hasMore={feedState.hasMore}
            endMessage={
              <Box
                sx={{ py: 4 }}
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'center'}
              >
                {feedState.posts.length > 0 ? (
                  <>
                    <Typography variant={'body1'}>That&apos; s all for now.</Typography>
                    <Link
                      sx={{ p: 0, m: 0 }}
                      component={'button'}
                      variant={'body1'}
                      onClick={() => {
                        document.body.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Back to top.
                    </Link>
                  </>
                ) : (
                  <Typography variant={'body1'}>No posts yet. Now&apos;s your chance to create history.</Typography>
                )}
              </Box>
            }
            loader={
              <Box sx={{ p: 4 }} display={'flex'} justifyContent={'center'}>
                <CircularProgress size={24} color='primary' />
              </Box>
            }
            dataLength={feedState.posts.length}
          >
            {feedState.posts.map((p) => (
              <FeedPost post={p} key={p.id} />
            ))}
          </InfiniteScroll>
        )}
      </Container>

      <Dialog
        sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}
        onClose={handlePostFormClose}
        open={postState.formOpen}
      >
        <DialogTitle>
          <Typography variant={'body1'}>Create New Post</Typography>
          <IconButton
            aria-label='close'
            onClick={handlePostFormClose}
            disabled={isPostLoading}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box width={'500px'} component='form' noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
            <TextField
              rows={postState.image ? undefined : 8}
              fullWidth
              multiline
              onChange={(event) =>
                setPostState({
                  text: event.target.value,
                  image: postState.image,
                  formOpen: postState.formOpen
                })
              }
              variant={'outlined'}
              sx={{
                '.MuiOutlinedInput-root': {
                  paddingX: '1.0rem',
                  paddingBottom: '0.5rem',
                  flexDirection: 'column'
                }
              }}
              InputProps={{
                endAdornment: postState.image && (
                  <Box sx={{ pt: 2, position: 'relative' }}>
                    <Paper
                      variant='elevation'
                      elevation={3}
                      width={'470px'}
                      component={'img'}
                      sx={{ position: 'relative' }}
                      src={URL.createObjectURL(postState.image)}
                    />
                    <IconButton
                      sx={{ position: 'absolute', right: 0, top: '1rem' }}
                      onClick={() => {
                        setPostState({
                          text: postState.text,
                          image: undefined,
                          formOpen: postState.formOpen
                        });
                      }}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                )
              }}
              disabled={isPostLoading}
            />
            <Box sx={{ mt: 3 }} display={'flex'} alignItems={'center'} justifyContent={'center'}>
              <Box>
                <label htmlFor='upload-photo'>
                  <input
                    disabled={isPostLoading}
                    style={{ display: 'none' }}
                    id='upload-photo'
                    name='upload-photo'
                    type='file'
                    accept={acceptedImageTypes.join(',')}
                    onChange={onImageChange}
                  />
                  <Button sx={{ height: '100%' }} disabled={isPostLoading} component='span' variant='contained'>
                    <AddPhotoAlternateIcon />
                  </Button>
                </label>
              </Box>
              <Box flexGrow={1} sx={{ pl: 2 }}>
                <LoadingButton loading={isPostLoading} type='submit' fullWidth variant='contained'>
                  Post
                </LoadingButton>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
