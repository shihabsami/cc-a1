import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import * as React from 'react';

export default function Copyright() {
  return (
    <Typography variant='body2' color='text.secondary' align='center' sx={{ mt: 5 }}>
      {'Copyright © '}
      <Link color='inherit' href='mailto:s3823710@student.rmit.edu.au'>
        Shihab Sami
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
