'use client';

import {
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useEffect, useState, useMemo } from 'react';
import { type Animal } from '../types';
import { ANIMALS_PER_PAGE } from '../services/utils';
import { AnimalCard } from './components/AnimalCard';
import { FilterControls } from './components/FilterControls';
import { LoadingIndicator } from './components/LoadingIndicator';

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

  const parseWeeks = (input: string): number => {
    const match = input.match(/\b(\d+)\s+week(s)?\b/i);
    return match ? parseInt(match[1], 10) : 0;
  }

  const years = parseYears(age);
  const months = parseMonths(age);
  const weeks = parseWeeks(age);

  return years + (months / 12) + (weeks / 52);
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
  const [locationFilter, setLocationFilter] = useState('All');
  const [arrivalDateFilter, setArrivalDateFilter] = useState<Date | null>(null);
  const [genderFilter, setGenderFilter] = useState('All');
  const [adoptionFeeFilter, setAdoptionFeeFilter] = useState('');

  const percentOfAnimalIdsLoaded = useMemo(() => {
    const percentage = Math.round(numberOfAnimalIdsLoaded / totalNumberOfAnimalsToLoad * 100);
    return Number.isNaN(percentage) ? 0 : percentage;
  }, [numberOfAnimalIdsLoaded, totalNumberOfAnimalsToLoad]);

  const percentOfAnimalDataLoaded = useMemo(() => {
    const percentage = Math.round(numberOfAnimalsLoaded / totalNumberOfAnimalsToLoad * 100);
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
      let aValue: string | number;
      let bValue: string | number;
  
      switch (sortBy) {
        case 'age':
          aValue = getAgeValue(a[sortBy]);
          bValue = getAgeValue(b[sortBy]);
          break;
        case 'adoptionFee':
          aValue = getAdoptionFeeValue(a[sortBy]);
          bValue = getAdoptionFeeValue(b[sortBy]);
          break;
        case 'weight':
          aValue = parseFloat(a[sortBy]);
          bValue = parseFloat(b[sortBy]);
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }

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
          {isLoading ? (
            <LoadingIndicator
              percentOfAnimalIdsLoaded={percentOfAnimalIdsLoaded}
              percentOfAnimalDataLoaded={percentOfAnimalDataLoaded}
            />
          ) : sortedAnimalData ? (
            <>
              <FilterControls
                idFilter={idFilter}
                setIdFilter={setIdFilter}
                nameFilter={nameFilter}
                setNameFilter={setNameFilter}
                breedFilter={breedFilter}
                setBreedFilter={setBreedFilter}
                ageFilter={ageFilter}
                setAgeFilter={setAgeFilter}
                weightFilter={weightFilter}
                setWeightFilter={setWeightFilter}
                locationFilter={locationFilter}
                setLocationFilter={setLocationFilter}
                arrivalDateFilter={arrivalDateFilter}
                setArrivalDateFilter={setArrivalDateFilter}
                genderFilter={genderFilter}
                setGenderFilter={setGenderFilter}
                adoptionFeeFilter={adoptionFeeFilter}
                setAdoptionFeeFilter={setAdoptionFeeFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                genderOptions={genderOptions}
                locationOptions={locationOptions}
                sortableFields={SORTABLE_FIELDS}
              />
              <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
                {sortedAnimalData.map((animal) => (
                  <AnimalCard key={animal.id} animal={animal} />
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
