'use client';

import {
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  CircularProgress,
  CardMedia,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useEffect, useState, useMemo } from 'react';
import { type Animal } from '../types';

const SORTABLE_FIELDS: (keyof Animal)[] = ['name', 'breed', 'age', 'gender', 'weight', 'arrivalDate', 'location', 'level', 'adoptionFee'];

export default function Home() {
  const [animalData, setAnimalData] = useState<Animal[] | null>(null);
  const [loadingAnimals, setLoadingAnimals] = useState(true);
  const [sortBy, setSortBy] = useState<keyof Animal>('name');
  const [nameFilter, setNameFilter] = useState('');
  const [breedFilter, setBreedFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [weightFilter, setWeightFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [arrivalDateFilter, setArrivalDateFilter] = useState<Date | null>(null);
  const [genderFilter, setGenderFilter] = useState('All');
  const [adoptionFeeFilter, setAdoptionFeeFilter] = useState('');

  const genderOptions = useMemo(() => {
    if (!animalData) return ['All'];
    const genders = animalData.map(animal => animal.gender);
    return ['All', ...Array.from(new Set(genders))];
  }, [animalData]);

  const filteredAnimalData = useMemo(() => {
    if (!animalData) return null;

    return animalData.filter(animal => {
      const nameMatch = animal.name.toLowerCase().includes(nameFilter.toLowerCase());
      const breedMatch = animal.breed.toLowerCase().includes(breedFilter.toLowerCase());
      const ageMatch = animal.age.toLowerCase().includes(ageFilter.toLowerCase());
      const weightMatch = animal.weight.toLowerCase().includes(weightFilter.toLowerCase());
      const locationMatch = animal.location.toLowerCase().includes(locationFilter.toLowerCase());

      let arrivalDateMatch = true;
      if (arrivalDateFilter) {
        const animalArrivalDate = new Date(animal.arrivalDate);
        if (!isNaN(animalArrivalDate.getTime())) {
          arrivalDateFilter.setHours(0, 0, 0, 0);
          animalArrivalDate.setHours(0, 0, 0, 0);
          arrivalDateMatch = animalArrivalDate.getTime() >= arrivalDateFilter.getTime();
        } else {
          arrivalDateMatch = false;
        }
      }

      const genderMatch = genderFilter === 'All' || animal.gender === genderFilter;
      const adoptionFeeMatch = animal.adoptionFee.toLowerCase().includes(adoptionFeeFilter.toLowerCase());
      return nameMatch && breedMatch && ageMatch && weightMatch && locationMatch && arrivalDateMatch && genderMatch && adoptionFeeMatch;
    });
  }, [animalData, nameFilter, breedFilter, ageFilter, weightFilter, locationFilter, arrivalDateFilter, genderFilter, adoptionFeeFilter]);

  const sortedAnimalData = useMemo(() => {
    if (!filteredAnimalData) return null;

    return [...filteredAnimalData].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    });
  }, [filteredAnimalData, sortBy]);

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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
              <Box sx={{
                marginBottom: 4,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 2
              }}>
                <TextField
                  label="Filter by Name"
                  variant="outlined"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Filter by Breed"
                  variant="outlined"
                  value={breedFilter}
                  onChange={(e) => setBreedFilter(e.target.value)}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Filter by Age"
                  variant="outlined"
                  value={ageFilter}
                  onChange={(e) => setAgeFilter(e.target.value)}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Filter by Weight"
                  variant="outlined"
                  value={weightFilter}
                  onChange={(e) => setWeightFilter(e.target.value)}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Filter by Location"
                  variant="outlined"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  sx={{ flex: 1 }}
                />
                <DatePicker
                  label="Filter by Arrival Date"
                  value={arrivalDateFilter}
                  onChange={(newValue) => setArrivalDateFilter(newValue)}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Filter by Adoption Fee"
                  variant="outlined"
                  value={adoptionFeeFilter}
                  onChange={(e) => setAdoptionFeeFilter(e.target.value)}
                  sx={{ flex: 1 }}
                />
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel id="gender-filter-label">Filter by Gender</InputLabel>
                  <Select
                    labelId="gender-filter-label"
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                  >
                    {genderOptions.map((gender) => (
                      <MenuItem key={gender} value={gender}>
                        {gender}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ flex: 1 }}>
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
    </LocalizationProvider>
  );
}
