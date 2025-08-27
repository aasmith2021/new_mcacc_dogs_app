'use client';

import { Container, Typography, Box, AppBar, Toolbar, Card, CardContent, CircularProgress, CardMedia } from '@mui/material';
import { useEffect, useState } from 'react';
import { type Animal } from '../types';

export default function Home() {
  const [data, setData] = useState<Animal[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch('/api/scrape');
        const { animals } = await response.json();
        setData(animals);
      } catch (error) {
        console.error('Error fetching animals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
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
          ) : data ? (
            <>
              <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
                {data.map((animal) => (
                  <Card key={animal.id}>
                    <CardMedia
                      sx={{ height: 300 }}
                      image={animal.image}
                      title={animal.name}
                    />
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {animal.name}
                      </Typography>
                      <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {animal.breed}
                      </Typography>
                      <Typography variant="body2">
                        ID: {animal.id}<br />
                        Age: {animal.age}<br />
                        Gender: {animal.gender}<br />
                        Weight: {animal.weight}<br />
                        Arrived: {animal.arrivalDate}<br />
                        Location: {animal.location}<br />
                        Level: {animal.level}<br />
                        Adoption Fee: {animal.adoptionFee}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </>
          ) : (
            <Typography>No data available.</Typography>
          )}
        </Box>
      </Container>
    </>
  );
}
