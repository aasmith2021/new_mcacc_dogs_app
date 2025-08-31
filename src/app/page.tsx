'use client';

import { Container, Typography, Box, AppBar, Toolbar, Card, CardContent, CircularProgress, CardMedia, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import { type Animal } from '../types';

const SORTABLE_FIELDS: (keyof Animal)[] = ['name', 'breed', 'age', 'gender', 'weight', 'arrivalDate', 'location', 'level', 'adoptionFee'];

export default function Home() {
  const [animalData, setAnimalData] = useState<Animal[] | null>(null);
  const [loadingAnimals, setLoadingAnimals] = useState(true);
  const [sortBy, setSortBy] = useState<keyof Animal>('name');

  const sortedAnimalData = useMemo(() => {
    if (!animalData) return null;

    return [...animalData].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    });
  }, [animalData, sortBy]);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const animalIdsResponse = await fetch('/api/scrape/animalIds');
        const { animalIds } = await animalIdsResponse.json();

        console.log(animalIds.length);

        const animalDataRequest = new Request('/api/scrape/animalData', { method: 'POST', body: JSON.stringify(animalIds) } );
        const animalDataResponse = await fetch(animalDataRequest);
        const { animals } = await animalDataResponse.json();
        setAnimalData(animals);
      } catch (error) {
        console.error('Error fetching animal data:', error);
      } finally {
        setLoadingAnimals(false);
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
          {loadingAnimals ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <CircularProgress />
              <Typography variant="h6" component="div">
                Loading Animals...
              </Typography>
            </Box>
          ) : sortedAnimalData ? (
            <>
              <Box sx={{ marginBottom: 4 }}>
                <FormControl fullWidth>
                  <InputLabel id="sort-by-label">Sort By</InputLabel>
                  <Select
                    labelId="sort-by-label"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as keyof Animal)}
                  >
                    {SORTABLE_FIELDS.map((field) => (
                      <MenuItem key={field} value={field}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
                {sortedAnimalData.map((animal) => (
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
