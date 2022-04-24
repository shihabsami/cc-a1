import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import { RateReviewRounded, CloseRounded, AddPhotoAlternateRounded, DeleteRounded } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { api } from '../util/api';
import { ACCEPTED_IMAGE_TYPES } from '../util/constants';
import { UserType } from '../util/types';
import LoadingButton from './LoadingButton';

export default function AddPost({ user, onSuccess }: { user?: UserType; onSuccess: () => void }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const textFieldRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File>();
  const resetImage = () => {
    image && setImage(undefined);
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    if (file && ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImage(file);
    } else {
      resetImage();
    }
  };

  const {
    isLoading: isPostLoading,
    isSuccess: isPostSuccess,
    mutate: mutatePost
  } = useMutation(async () => {
    const text = textFieldRef.current?.value;
    if (!text && !image) return;

    const formData = new FormData();
    formData.append('text', text || '');
    let response;
    if (image) {
      formData.append('image', image);
      response = await api.post('/posts/save/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } else {
      response = await api.post('/posts/save', formData);
    }

    return response;
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutatePost();
  };

  useEffect(() => {
    if (isPostSuccess) {
      setImage(undefined);
      setDialogOpen(false);
      onSuccess();
    }
  }, [isPostSuccess, onSuccess]);

  return (
    <>
      <Box sx={{ display: 'flex', mt: 3 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Button
            onClick={() => {
              setDialogOpen(true);
            }}
            variant='outlined'
            fullWidth
            sx={{ height: '100%', textAlign: 'left' }}
          >
            <Typography color='text.primary' variant='body1' textTransform='none'>
              {user?.firstName}, what&apos;s on your mind?
            </Typography>
          </Button>
        </Box>
        <Box sx={{ pl: 2 }}>
          <Button
            onClick={() => {
              setDialogOpen(true);
            }}
            variant='contained'
            fullWidth
            sx={{ height: '100%' }}
          >
            <RateReviewRounded />
          </Button>
        </Box>
      </Box>
      <Dialog
        sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}
        onClose={() => {
          !isPostLoading && setDialogOpen(false);
        }}
        open={dialogOpen}
      >
        <DialogTitle>
          <Typography variant='body1'>Create New Post</Typography>
          <IconButton
            aria-label='close'
            onClick={() => setDialogOpen(false)}
            disabled={isPostLoading}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
          >
            <CloseRounded />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box width='500px' component='form' noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
            <Paper variant='outlined' sx={{ p: 2, pb: 1.5, pt: 0, minHeight: '250px' }}>
              <TextField
                margin='normal'
                fullWidth
                rows={image ? undefined : 8}
                multiline
                inputRef={textFieldRef}
                variant='standard'
                sx={{
                  '.MuiOutlinedInput-root': {
                    paddingX: '1.0rem',
                    paddingBottom: '0.5rem',
                    flexDirection: 'column'
                  }
                }}
                disabled={isPostLoading}
                InputProps={{
                  disableUnderline: true
                }}
              />
              {image && (
                <Box sx={{ pt: 2, position: 'relative' }}>
                  <Paper
                    elevation={5}
                    component='img'
                    sx={{
                      width: '100%',
                      position: 'relative'
                    }}
                    alt='Post Image.'
                    src={URL.createObjectURL(image)}
                  />
                  <IconButton
                    disabled={isPostLoading}
                    sx={{ position: 'absolute', right: 0, top: '1rem' }}
                    onClick={() => setImage(undefined)}
                  >
                    <DeleteRounded />
                  </IconButton>
                </Box>
              )}
            </Paper>
            <Box sx={{ mt: 3 }} display='flex' alignItems='center' justifyContent='center'>
              <Box>
                <label htmlFor='upload-image'>
                  <input
                    disabled={isPostLoading}
                    style={{ display: 'none' }}
                    id='upload-image'
                    name='upload-image'
                    type='file'
                    accept={ACCEPTED_IMAGE_TYPES.join(',')}
                    onChange={handleImageChange}
                  />
                  <Button sx={{ height: '100%' }} disabled={isPostLoading} component='span' variant='contained'>
                    <AddPhotoAlternateRounded />
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
