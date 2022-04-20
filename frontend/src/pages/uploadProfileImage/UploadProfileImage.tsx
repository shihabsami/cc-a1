import { Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useContext, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { api } from '../../util/api';
import { GlobalContext } from '../../components/GlobalContext';
import LoadingButton from '../../components/LoadingButton';
import ProfileImage from '../../components/ProfileImage';
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import { acceptedImageTypes } from '../../util/constants';

export default function UploadProfileImage() {
  const { user, isLoading, isSignedIn } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [image, setImage] = useState<File>();
  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    if (file && acceptedImageTypes.includes(file.type)) {
      setImage(file);
    } else {
      !image && setImage(undefined);
    }
  };

  const {
    isLoading: isImageLoading,
    isSuccess: isImageSuccess,
    mutate: mutateImage
  } = useMutation(() => {
    const formData = new FormData();
    image && formData.append('image', image);
    user && formData.append('username', user.username);
    console.log('formData', formData);
    return api.post('/images/profile/save', formData, { headers: { 'Content-Type': `multipart/form-data` } });
  });

  useEffect(() => {
    if (isImageSuccess) return navigate('/feed');
  }, [isImageSuccess, navigate]);

  useEffect(() => {
    if (!isLoading && !isSignedIn()) {
      return navigate('/signin');
    }
  }, [isLoading, isSignedIn, navigate]);

  return (
    <Container component='div' maxWidth='md'>
      <Grid spacing={2} container direction='column' alignItems='center' justifyContent='center'>
        <Grid item xs={12} sx={{ mt: 3 }}>
          <Typography variant={'h6'}>Nice! Let&apos;s make it easier for others to recognise you.</Typography>
        </Grid>
        <Grid item xs={12}>
          <ProfileImage
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
              accept={acceptedImageTypes.join(',')}
              onChange={onImageChange}
            />
            <Button
              disabled={isImageLoading}
              sx={{ p: 1, width: '16rem' }}
              aria-label='add'
              component='span'
              variant='contained'
            >
              <AddPhotoAlternateRoundedIcon fontSize={'small'} sx={{ pl: 0, ml: 0 }} />
              <Typography sx={{ pl: 1 }} variant={'body2'} textTransform={'none'}>
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
              <Typography sx={{ pl: 1 }} variant={'body2'} textTransform={'none'}>
                Looks Good!
              </Typography>
            </LoadingButton>
          </Grid>
        )}
        <Grid item xs={12}>
          <Button sx={{ width: '16rem' }} disabled={isImageLoading} component={RouterLink} to='/feed' variant='text'>
            <Typography sx={{ pl: 1 }} variant={'body2'} textTransform={'none'}>
              Skip
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
