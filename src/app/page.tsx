'use client';

import { Container, Typography, Box, AppBar, Toolbar, Card, CardContent, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';

interface Animal {
  name: string;
  id: string;
  breed: string;
  age: string;
  gender: string;
  location: string;
  image: string;
}

interface ScrapeData {
  animals: Animal[];
  scrapedAt: string;
}

export default function Home() {
  const [data, setData] = useState<ScrapeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch('/api/scrape');
        const scrapeData = await response.json();
        setData(scrapeData);
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
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                Last updated: {new Date(data.scrapedAt).toLocaleString()}
              </Typography>
              <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
                {data.animals.map((animal) => (
                  <Card key={animal.id}>
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
                        Location: {animal.location}
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
