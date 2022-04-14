import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
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
import { red } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ShareIcon from '@mui/icons-material/Share';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import { useMutation } from 'react-query';
import { api } from '../../util/api';
import { useNavigate } from 'react-router-dom';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { GlobalContext } from '../../components/GlobalContext';
import LoadingButton from '../../components/LoadingButton';

export default function Feed() {
  const { user } = useContext(GlobalContext);
  const navigate = useNavigate();
  const values = ['alpha', 'beta'];
  const [postFormOpen, setPostFormOpen] = React.useState(false);
  const [text, setText] = useState<string | undefined>();
  const [image, setImage] = useState<File | undefined>();
  const acceptedImageTypes = ['image/jpeg', 'image/png'];

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    if (file && acceptedImageTypes.includes(file.type)) {
      setImage(file);
    } else {
      setImage(undefined);
    }
  };

  const handlePostFormOpen = () => {
    setPostFormOpen(true);
  };
  const handlePostFormClose = () => {
    setPostFormOpen(false);
  };

  const { data, error, isLoading, isSuccess, mutate } = useMutation(() => {
    const formData = new FormData();
    formData.append('text', text || '');
    if (image) {
      formData.append('image', image);
      return api.post('/posts/saveWithImage', formData, { headers: { 'Content-Type': `multipart/form-data` } });
    } else {
      return api.post('/posts/save', formData);
    }
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(text);
    console.log(image);
    console.log(user);

    mutate();
  };

  useEffect(() => {
    if (isSuccess) {
      setPostFormOpen(false);
      setText(undefined);
      setImage(undefined);
    } else {
      console.log(error);
    }
  }, [data, error, isSuccess, navigate]);

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

        {values.map((value) => (
          <Card key={value} sx={{ boxShadow: 3, maxWidth: 'sm', my: '2rem' }}>
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
              title={value}
              subheader='September 14, 2016'
            />
            <CardContent>
              <Typography variant='body2' color='text.secondary'>
                This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1
                cup of frozen peas along with the mussels, if you like.
              </Typography>
            </CardContent>
            <CardMedia
              component='img'
              sx={{
                backgroundColor: '#ff0000'
              }}
              image={`https://picsum.photos/${value.length * 250}/${value.length * 250}?random=${value}`}
              alt='Paella dish'
              onClick={handlePostFormOpen}
            />
            <CardActions disableSpacing>
              <IconButton aria-label='add to favorites'>
                <ThumbUpIcon />
              </IconButton>
              <IconButton aria-label='add to favorites'>
                <InsertCommentIcon />
              </IconButton>
              <IconButton aria-label='share'>
                <ShareIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Container>

      <Dialog
        sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}
        onClose={handlePostFormClose}
        open={postFormOpen}
      >
        <DialogTitle>
          <Typography variant={'body1'}>Create New Post</Typography>
          <IconButton
            aria-label='close'
            onClick={handlePostFormClose}
            disabled={isLoading}
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
              rows={image ? undefined : 8}
              fullWidth
              multiline
              onChange={(event) => setText(event.target.value)}
              variant={'outlined'}
              sx={{
                '.MuiOutlinedInput-root': {
                  paddingX: '1.0rem',
                  paddingBottom: '0.5rem',
                  flexDirection: 'column'
                }
              }}
              InputProps={{
                endAdornment: image && (
                  <Box sx={{ pt: 2 }}>
                    <Paper
                      width={'370px'}
                      variant='elevation'
                      elevation={3}
                      component={'img'}
                      src={URL.createObjectURL(image)}
                    />
                  </Box>
                )
              }}
            />
            <Box sx={{ mt: 3 }} display={'flex'} alignItems={'center'} justifyContent={'center'}>
              <Box>
                <label htmlFor='upload-photo'>
                  <input
                    disabled={isLoading}
                    style={{ display: 'none' }}
                    id='upload-photo'
                    name='upload-photo'
                    type='file'
                    accept={acceptedImageTypes.join(',')}
                    onChange={onImageChange}
                  />
                  <Button sx={{ height: '100%' }} disabled={isLoading} component='span' variant='contained'>
                    <AddPhotoAlternateIcon />
                  </Button>
                </label>
              </Box>
              <Box flexGrow={1} sx={{ pl: 2 }}>
                <LoadingButton loading={isLoading} type='submit' fullWidth variant='contained'>
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
