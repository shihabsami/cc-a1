import { Container, Typography } from '@mui/material';
import { ReactSVG } from 'react-svg';
import React from 'react';

export default function Home() {
  return (
    <>
      <Container maxWidth='md'>
        <Typography variant='h3' component='div' sx={{ marginTop: '4rem', flexGrow: 1 }}>
          Welcome!
        </Typography>
        <Typography component='div' sx={{ marginY: '1.5rem', flexGrow: 1 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sapien enim, lobortis ac justo vel,
          vestibulum pulvinar neque. In ac sodales libero, sed viverra ligula. Nam non lobortis ligula, non tempor
          nulla.
        </Typography>
        <ReactSVG src={'/flat-mountains.svg'} />
      </Container>
    </>
  );
}
