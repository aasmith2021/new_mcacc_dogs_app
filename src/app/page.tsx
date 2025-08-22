'use client';

import {
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  CardMedia,
  Grid,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';

interface Dog {
  name: string;
  breed: string;
  age: string;
  image: string;
}

export default function Home() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const response = await fetch('/api/scrape');
        const data = await response.json();
        setDogs(data.dogs);
      } catch (error) {
        console.error('Failed to fetch dogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, []);

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'primary.main', color: 'white' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            New Dogs at MCACC
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={4}>
              {dogs.map((dog, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Card>
                    <CardMedia component="img" height="250" image={dog.image} alt={dog.name} />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {dog.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dog.breed}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dog.age}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </>
  );
}
