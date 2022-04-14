import { Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { api } from '../../util/api';
import { GlobalContext } from '../../components/GlobalContext';
import LoadingButton from '../../components/LoadingButton';
import ProfileImage from '../../components/ProfileImage';

export default function UploadProfileImage() {
  const { user } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [image, setImage] = useState<File>();
  const acceptedImageTypes = ['image/jpeg', 'image/png'];

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    if (file && acceptedImageTypes.includes(file.type)) {
      setImage(file);
    } else {
      setImage(undefined);
    }
  };

  const { isLoading, isSuccess, mutate } = useMutation(() => {
    const formData = new FormData();
    image && formData.append('image', image);
    user && formData.append('username', user.username);
    console.log(formData);
    return api.post('/images/saveProfileImage', formData, { headers: { 'Content-Type': `multipart/form-data` } });
  });

  const saveImage = () => {
    mutate();
  };

  useEffect(() => {
    if (isSuccess) {
      return navigate('/feed');
    }
  }, [navigate, isSuccess]);

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
              disabled={isLoading}
              style={{ display: 'none' }}
              id='upload-photo'
              name='upload-photo'
              type='file'
              accept={acceptedImageTypes.join(',')}
              onChange={onImageChange}
            />
            <Button
              disabled={isLoading}
              sx={{ p: 1, width: '16rem' }}
              aria-label='add'
              component='span'
              variant='contained'
            >
              <AddAPhotoIcon fontSize={'small'} sx={{ pl: 0, ml: 0 }} />
              <Typography sx={{ pl: 1 }} variant={'body2'} textTransform={'none'}>
                {image ? 'Try Again' : 'Upload Image'}
              </Typography>
            </Button>
          </label>
        </Grid>
        {image && (
          <Grid item xs={12}>
            <LoadingButton sx={{ width: '16rem' }} loading={isLoading} onClick={saveImage} variant='contained'>
              <Typography sx={{ pl: 1 }} variant={'body2'} textTransform={'none'}>
                Looks Good!
              </Typography>
            </LoadingButton>
          </Grid>
        )}
        <Grid item xs={12}>
          <Button sx={{ width: '16rem' }} disabled={isLoading} component={RouterLink} to='/feed' variant='text'>
            <Typography sx={{ pl: 1 }} variant={'body2'} textTransform={'none'}>
              Skip
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
