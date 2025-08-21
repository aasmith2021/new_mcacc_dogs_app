'use client';

import { Container, Typography, Box, AppBar, Toolbar } from '@mui/material';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'primary.main', color: 'white' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            New Dogs at MCACC
          </Typography>
        </Toolbar>
      </AppBar>
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
          <Box sx={{ mt: 4, width: '100%', maxWidth: '500px', height: 'auto' }}>
            <Image
              src="https://placedog.net/500/500"
              alt="A cute dog"
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
    </>
  );
}
