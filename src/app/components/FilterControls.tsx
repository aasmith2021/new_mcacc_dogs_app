'use client';

import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { type Animal } from '../../types';

interface FilterControlsProps {
  idFilter: string;
  setIdFilter: (value: string) => void;
  nameFilter: string;
  setNameFilter: (value: string) => void;
  breedFilter: string;
  setBreedFilter: (value: string) => void;
  ageFilter: string;
  setAgeFilter: (value: string) => void;
  weightFilter: string;
  setWeightFilter: (value: string) => void;
  locationFilter: string;
  setLocationFilter: (value: string) => void;
  arrivalDateFilter: Date | null;
  setArrivalDateFilter: (value: Date | null) => void;
  genderFilter: string;
  setGenderFilter: (value: string) => void;
  adoptionFeeFilter: string;
  setAdoptionFeeFilter: (value: string) => void;
  sortBy: keyof Animal;
  setSortBy: (value: keyof Animal) => void;
  genderOptions: string[];
  locationOptions: string[];
  sortableFields: (keyof Animal)[];
}

export const FilterControls = ({
  idFilter,
  setIdFilter,
  nameFilter,
  setNameFilter,
  breedFilter,
  setBreedFilter,
  ageFilter,
  setAgeFilter,
  weightFilter,
  setWeightFilter,
  locationFilter,
  setLocationFilter,
  arrivalDateFilter,
  setArrivalDateFilter,
  genderFilter,
  setGenderFilter,
  adoptionFeeFilter,
  setAdoptionFeeFilter,
  sortBy,
  setSortBy,
  genderOptions,
  locationOptions,
  sortableFields,
}: FilterControlsProps) => {
  return (
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
          {sortableFields.map((field) => (
            <MenuItem key={field} value={field}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
