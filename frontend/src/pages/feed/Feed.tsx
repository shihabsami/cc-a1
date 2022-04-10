import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Dialog,
  DialogTitle,
  IconButton,
  Typography
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { red } from '@mui/material/colors';
import DialogContent from '@mui/material/DialogContent';
import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';

export default function Feed() {
  const values = ['alpha', 'beta', 'charlie', 'deltaaaaa', 'epsilone'];
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Container maxWidth='sm'>
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
              onClick={handleClickOpen}
            />
            <Dialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
              <DialogTitle sx={{ m: 1.5, p: 2 }}>
                <IconButton
                  aria-label='close'
                  onClick={handleClose}
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
                <img
                  src={`https://picsum.photos/${value.length * 250}/${value.length * 250}?random=${value}`}
                  alt={value}
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
              </DialogContent>
            </Dialog>
            <CardActions disableSpacing>
              <IconButton aria-label='add to favorites'>
                <ThumbUpIcon />
              </IconButton>
              <IconButton aria-label='share'>
                <ShareIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Container>
    </>
  );
}
