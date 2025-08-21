'use client';

import { Container, Typography, Box } from '@mui/material';
import Image from 'next/image';

export default function Home() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          Hello World
        </Typography>
        <Box sx={{ mt: 4, width: '100%', maxWidth: '500px', height: 'auto' }}>
          <Image
            src="https://cataas.com/cat"
            alt="A cute cat"
            width={500}
            height={500}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '8px',
            }}
            priority
          />
        </Box>
      </Box>
    </Container>
  );
}
