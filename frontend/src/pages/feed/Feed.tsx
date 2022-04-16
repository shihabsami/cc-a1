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
import { useEffect, useState } from 'react';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation } from 'react-query';
import { api } from '../../util/api';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LoadingButton from '../../components/LoadingButton';
import { Post } from '../../util/types';
import InfiniteScroll from 'react-infinite-scroll-component';
import Link from '@mui/material/Link';
import FeedPost from '../../components/FeedPost';

type FeedState = {
  posts: Post[];
  page: number;
  hasMore: boolean;
};

type PostState = {
  text?: string;
  image?: File;
  formOpen: boolean;
};

export default function Feed() {
  const [feedState, setFeedState] = useState<FeedState>({ posts: [], page: -1, hasMore: false });
  const [postState, setPostState] = useState<PostState>({ formOpen: false });
  const acceptedImageTypes = ['image/jpeg', 'image/png'];

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    if (file && acceptedImageTypes.includes(file.type)) {
      setPostState({
        text: postState.text,
        image: file,
        formOpen: postState.formOpen
      });
    } else {
      setPostState({
        text: postState.text,
        image: undefined,
        formOpen: postState.formOpen
      });
    }
  };

  const handlePostFormOpen = () => {
    setPostState({
      text: postState.text,
      image: postState.image,
      formOpen: true
    });
  };
  const handlePostFormClose = () => {
    setPostState({
      text: postState.text,
      image: postState.image,
      formOpen: false
    });
  };

  const {
    isLoading: isPostLoading,
    isSuccess: isPostSuccess,
    mutate: mutatePost
  } = useMutation(() => {
    const formData = new FormData();
    formData.append('text', postState.text || '');
    if (postState.image) {
      formData.append('image', postState.image);
      return api.post('/posts/saveWithImage', formData, { headers: { 'Content-Type': `multipart/form-data` } });
    } else {
      return api.post('/posts/save', formData);
    }
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
        const updatedPosts = {
          posts: feedState.posts.concat(response.data as Post[]),
          page: nextPage,
          hasMore: await api
            .get('/posts/hasMore', {
              params: {
                page: nextPage
              }
            })
            .then((response) => response.data as boolean)
        };
        setFeedState(updatedPosts);
      });
  };

  const { isLoading: isFeedLoading, mutate: mutateFeed } = useMutation(fetchMorePosts);

  useEffect(() => {
    mutateFeed();
  }, [mutateFeed]);

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

  return (
    <Container>
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
                What&apos;s on your mind?
              </Typography>
            </Button>
          </Box>
          <Box sx={{ pl: 2 }}>
            <Button onClick={handlePostFormOpen} variant='contained' fullWidth sx={{ height: '100%' }}>
              <RateReviewIcon />
            </Button>
          </Box>
        </Box>
        <Divider sx={{ pt: 3 }} />

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
                sx={{ pb: 4 }}
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'center'}
              >
                <Typography variant={'body1'}>That&apos;s all for now. </Typography>
                <Link
                  sx={{ p: 0, m: 0 }}
                  component={'button'}
                  variant={'body1'}
                  onClick={() => {
                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth' // for smoothly scrolling
                    });
                  }}
                >
                  Back to top.
                </Link>
              </Box>
            }
            loader={
              <Box sx={{ pb: 4 }} display={'flex'} justifyContent={'center'}>
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
          <Box width={'400px'} component='form' noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
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
                  <Box sx={{ pt: 2 }}>
                    <Paper
                      width={'370px'}
                      variant='elevation'
                      elevation={3}
                      component={'img'}
                      src={URL.createObjectURL(postState.image)}
                    />
                  </Box>
                )
              }}
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
    </Container>
  );
}
