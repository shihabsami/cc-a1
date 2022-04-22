import { Container, Typography } from '@mui/material';

export default function Home() {
  return (
    <Container
      maxWidth='lg'
      sx={{
        height: 'calc(100vh - 4rem)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Container sx={{ mt: '4rem', flexGrow: 1 }}>
        <Typography variant='h3'>Welcome!</Typography>
        <Typography sx={{ marginY: '1.5rem' }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sapien enim, lobortis ac justo vel,
          vestibulum pulvinar neque. In ac sodales libero, sed viverra ligula. Nam non lobortis ligula, non tempor
          nulla.
        </Typography>
      </Container>
      <img src='/flat-mountains.svg' alt='Flat Mountains' />
    </Container>
  );
}
