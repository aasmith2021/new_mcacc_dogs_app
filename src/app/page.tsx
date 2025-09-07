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
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useEffect, useState, useMemo } from 'react';
import { type Animal } from '../types';
import { ANIMAL_DATA_PAGE_BASE_URL, ANIMALS_PER_PAGE } from '../services/utils';

const SORTABLE_FIELDS: (keyof Animal)[] = ['id', 'name', 'breed', 'age', 'gender', 'weight', 'arrivalDate', 'location', 'level', 'adoptionFee'];

const getAdoptionFeeValue = (fee: string): number => {
  if (!fee) return 0;
  const cleanedFee = fee.replace('$', '');
  const numericValue = parseFloat(cleanedFee);
  return isNaN(numericValue) ? 0 : numericValue;
};

const getAgeValue = (age: string): number => {
  if (!age) return 0;

  const parseYears = (input: string): number => {
    const match = input.match(/\b(\d+)\s+year(s)?\b/i);
    return match ? parseInt(match[1], 10) : 0;
  }

  const parseMonths = (input: string): number => {
    const match = input.match(/\b(\d+)\s+month(s)?\b/i);
    return match ? parseInt(match[1], 10) : 0;
  }

  const years = parseYears(age);
  const months = parseMonths(age);

  return years + (months / 12);
};

export default function Home() {
  const [totalNumberOfAnimalsToLoad, setTotalNumberOfAnimalsToLoad] = useState<number>(0);
  const [numberOfAnimalIdsLoaded, setNumberOfAnimalIdsLoaded] = useState<number>(0);
  const [numberOfAnimalsLoaded, setNumberOfAnimalsLoaded] = useState<number>(0);
  const [animalData, setAnimalData] = useState<Animal[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<keyof Animal>('name');
  const [idFilter, setIdFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [breedFilter, setBreedFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [weightFilter, setWeightFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [arrivalDateFilter, setArrivalDateFilter] = useState<Date | null>(null);
  const [genderFilter, setGenderFilter] = useState('All');
  const [adoptionFeeFilter, setAdoptionFeeFilter] = useState('');

  const theme = useTheme();

  const percentOfAnimalIdsLoaded = useMemo(() => {
    const percentage = Math.round(numberOfAnimalIdsLoaded / totalNumberOfAnimalsToLoad * 100);
    return Number.isNaN(percentage) ? 0 : percentage;
  }, [numberOfAnimalIdsLoaded, totalNumberOfAnimalsToLoad]);

  const percentOfAnimalDataLoaded = useMemo(() => {
    const percentage = Math.round(numberOfAnimalsLoaded   / totalNumberOfAnimalsToLoad * 100);
    return Number.isNaN(percentage) ? 0 : percentage;
  }, [numberOfAnimalsLoaded, totalNumberOfAnimalsToLoad]);

  const genderOptions = useMemo(() => {
    if (!animalData) return ['All'];
    const genders = animalData.map(animal => animal.gender);
    return ['All', ...Array.from(new Set(genders))];
  }, [animalData]);

  const locationOptions = ['All', 'East Kennel', 'West Kennel', 'PetSmart Old Town Scottsdale', 'Foster'];

  const filteredAnimalData = useMemo(() => {
    if (!animalData) return null;

    return animalData.filter(animal => {
      const idMatch = animal.id.toLowerCase().includes(idFilter.toLowerCase());
      const nameMatch = animal.name.toLowerCase().includes(nameFilter.toLowerCase());
      const breedMatch = animal.breed.toLowerCase().includes(breedFilter.toLowerCase());

      let ageMatch = true;
      if (ageFilter) {
        const filterValue = parseFloat(ageFilter);
        if (!isNaN(filterValue)) {
          const animalAge = getAgeValue(animal.age);
          console.log(animalAge);
          ageMatch = animalAge <= filterValue;
        }
      }

      let weightMatch = true;
      if (weightFilter) {
        const filterValue = parseFloat(weightFilter);
        if (!isNaN(filterValue)) {
          weightMatch = parseFloat(animal.weight) <= filterValue;
        }
      }

      const locationMatch = locationFilter === 'All' || animal.location.toLowerCase().includes(locationFilter.toLowerCase());

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

      let adoptionFeeMatch = true;
      if (adoptionFeeFilter) {
        const filterValue = parseFloat(adoptionFeeFilter);
        if (!isNaN(filterValue)) {
          const animalAdoptionFee = getAdoptionFeeValue(animal.adoptionFee);
          adoptionFeeMatch = animalAdoptionFee <= filterValue;
        }
      }

      return idMatch && nameMatch && breedMatch && ageMatch && weightMatch && locationMatch && arrivalDateMatch && genderMatch && adoptionFeeMatch;
    });
  }, [animalData, idFilter, nameFilter, breedFilter, ageFilter, weightFilter, locationFilter, arrivalDateFilter, genderFilter, adoptionFeeFilter]);


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

  const fetchNumberOfAnimals = async () => (await (await fetch('/api/scrape/numberOfAnimals')).json()).numberOfAnimals;
  const fetchSingleAnimalIdBatch = async (pageNumber: number) => {
    const animalIdBatch = (await (await fetch(new Request('/api/scrape/animalIdBatch', { method: 'POST', body: JSON.stringify(pageNumber) }))).json()).animalIds;
    setNumberOfAnimalIdsLoaded((currentNumber) => currentNumber + animalIdBatch.length);
    return animalIdBatch;
  };
  const fetchSingleAnimalData = async (animalId: string) => {
    const singleAnimalData = (await (await fetch(new Request('/api/scrape/singleAnimalData', { method: 'POST', body: JSON.stringify(animalId) }))).json()).singleAnimalData;
    setNumberOfAnimalsLoaded((currentNumber) => currentNumber + 1);
    return singleAnimalData;
  };

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const numberOfAnimals = await fetchNumberOfAnimals();
        setTotalNumberOfAnimalsToLoad(numberOfAnimals);

        const numberOfPages = Math.ceil(numberOfAnimals / ANIMALS_PER_PAGE);
        const pages = Array(numberOfPages).fill('').map((_, index) => index);
        const animalIds = (await Promise.all(pages.map(fetchSingleAnimalIdBatch))).flat();
        
        const allAnimalData = (await Promise.allSettled(animalIds.map(fetchSingleAnimalData))).map((settledResult) => {
          if (settledResult.status === 'fulfilled') {
            return settledResult.value;
          }
          return null;
        }).filter((animalData) => animalData);
        setAnimalData(allAnimalData);
      } catch (error) {
        console.error('Error fetching animal data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  const getLoadingProgress = () => (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px', marginBottom: '25px' }}>
        <Typography variant="h6" component="div" align="center">
          Loading Animal Ids
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="determinate" value={percentOfAnimalIdsLoaded} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary' }}
              >{`${percentOfAnimalIdsLoaded}%`}</Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
        <Typography variant="h6" component="div" align="center">
          Loading Animal Data
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="determinate" value={percentOfAnimalDataLoaded} color="secondary" />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary' }}
              >{`${percentOfAnimalDataLoaded}%`}</Typography>
          </Box>
        </Box>
      </Box>
    </>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <AppBar position="static" sx={{ backgroundColor: 'primary.main', color: 'white' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Dogs at MCACC
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          {isLoading ? getLoadingProgress() : sortedAnimalData ? (
            <>
              <Box sx={{
                marginBottom: 4,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 2
              }}>
                <TextField
                  label="Filter by Id"
                  variant="outlined"
                  value={idFilter}
                  onChange={(e) => setIdFilter(e.target.value)}
                  sx={{ flex: 1 }}
                  InputProps={{
                    endAdornment: idFilter && (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setIdFilter('')} edge="end">
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Filter by Name"
                  variant="outlined"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  sx={{ flex: 1 }}
                  InputProps={{
                    endAdornment: nameFilter && (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setNameFilter('')} edge="end">
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Filter by Breed"
                  variant="outlined"
                  value={breedFilter}
                  onChange={(e) => setBreedFilter(e.target.value)}
                  sx={{ flex: 1 }}
                  InputProps={{
                    endAdornment: breedFilter && (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setBreedFilter('')} edge="end">
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Filter by Max. Age"
                  variant="outlined"
                  value={ageFilter}
                  onChange={(e) => setAgeFilter(e.target.value)}
                  sx={{ flex: 1 }}
                  InputProps={{
                    endAdornment: ageFilter && (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setAgeFilter('')} edge="end">
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Filter by Max. Weight"
                  variant="outlined"
                  value={weightFilter}
                  onChange={(e) => setWeightFilter(e.target.value)}
                  sx={{ flex: 1 }}
                  InputProps={{
                    endAdornment: weightFilter && (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setWeightFilter('')} edge="end">
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel id="location-filter-label">Filter by Location</InputLabel>
                  <Select
                    labelId="location-filter-label"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  >
                    {locationOptions.map((location) => (
                      <MenuItem key={location} value={location}>
                        {location}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <DatePicker
                  label="Filter by Min. Arrival Date"
                  value={arrivalDateFilter}
                  onChange={(newValue) => setArrivalDateFilter(newValue)}
                  sx={{ flex: 1 }}
                  slotProps={{
                    textField: {
                      InputProps: {
                        endAdornment: arrivalDateFilter && (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setArrivalDateFilter(null)} edge="end">
                              <ClearIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    },
                  }}
                />
                <TextField
                  label="Filter by Max. Adoption Fee"
                  variant="outlined"
                  value={adoptionFeeFilter}
                  onChange={(e) => setAdoptionFeeFilter(e.target.value)}
                  sx={{ flex: 1 }}
                  InputProps={{
                    endAdornment: adoptionFeeFilter && (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setAdoptionFeeFilter('')} edge="end">
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
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
                  <Card
                    key={animal.id}
                    sx={{
                      transition: 'box-shadow 0.2s ease-in-out',
                      '&:hover': {
                        color: theme.palette.secondary.main,
                        boxShadow: `0px 4px 30px ${theme.palette.secondary.main}`,
                        cursor: 'pointer',
                      },
                    }}
                    onClick={() => { window.open(`${ANIMAL_DATA_PAGE_BASE_URL}${animal.id}`, '_blank')}}
                  >
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
