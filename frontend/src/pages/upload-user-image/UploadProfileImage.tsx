import { useContext, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Grid, Typography } from '@mui/material';
import { AddPhotoAlternateRounded } from '@mui/icons-material';
import { GlobalContext } from '../../components/GlobalContext';
import { api } from '../../util/api';
import { ACCEPTED_IMAGE_TYPES } from '../../util/constants';
import LoadingButton from '../../components/LoadingButton';
import UserImage from '../../components/UserImage';
import MessageSnackbar from '../../components/MessageSnackbar';

export default function UploadProfileImage() {
  const { user, isContextLoading: isLoading, isSignedIn } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [image, setImage] = useState<File>();
  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    if (file && ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImage(file);
    } else {
      !image && setImage(undefined);
    }
  };

  const {
    isLoading: isImageLoading,
    isSuccess: isImageSuccess,
    isError: isError,
    mutate: mutateImage
  } = useMutation(() => {
    const formData = new FormData();
    image && formData.append('image', image);
    user && formData.append('username', user.username);
    return api.post('/images/user/save', formData, { headers: { 'Content-Type': `multipart/form-data` } });
  });

  useEffect(() => {
    if (isImageSuccess) {
      return navigate('/feed');
    }
  }, [isImageSuccess, navigate]);

  useEffect(() => {
    if (!isLoading && !isSignedIn()) {
      return navigate('/sign-in');
    }
  }, [isLoading, isSignedIn, navigate]);

  return (
    <Container component='div' maxWidth='md'>
      <Grid spacing={2} container direction='column' alignItems='center' justifyContent='center'>
        <Grid item xs={12} sx={{ mt: 3 }}>
          <Typography variant='h6'>Nice! Let&apos;s make it easier for others to recognise you.</Typography>
        </Grid>
        <Grid item xs={12}>
          <UserImage
            src={image && URL.createObjectURL(image)}
            sx={{ border: '3px solid #b39ddb', width: 128, height: 128 }}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 3 }}>
          <label htmlFor='upload-photo'>
            <input
              disabled={isImageLoading}
              style={{ display: 'none' }}
              id='upload-photo'
              name='upload-photo'
              type='file'
              accept={ACCEPTED_IMAGE_TYPES.join(',')}
              onChange={onImageChange}
            />
            <Button
              disabled={isImageLoading}
              sx={{ p: 1, width: '16rem' }}
              aria-label='add'
              component='span'
              variant='contained'
            >
              <AddPhotoAlternateRounded fontSize='small' sx={{ pl: 0, ml: 0 }} />
              <Typography sx={{ pl: 1 }} variant='body2' textTransform='none'>
                {image ? 'Try Again' : 'Upload Image'}
              </Typography>
            </Button>
          </label>
        </Grid>
        {image && (
          <Grid item xs={12}>
            <LoadingButton
              sx={{ width: '16rem' }}
              loading={isImageLoading}
              onClick={() => mutateImage()}
              variant='contained'
            >
              <Typography sx={{ pl: 1 }} variant='body2' textTransform='none'>
                Looks Good!
              </Typography>
            </LoadingButton>
          </Grid>
        )}
        <Grid item xs={12}>
          <Button sx={{ width: '16rem' }} disabled={isImageLoading} href='/feed' variant='text'>
            <Typography sx={{ pl: 1 }} variant='body2' textTransform='none'>
              Skip
            </Typography>
          </Button>
        </Grid>
      </Grid>
      <MessageSnackbar message='Could not upload image. Please try again.' open={isError} severity={'error'} />
    </Container>
  );
}
