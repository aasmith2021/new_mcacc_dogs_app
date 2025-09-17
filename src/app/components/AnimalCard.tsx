'use client';

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  useTheme,
} from '@mui/material';
import { type Animal } from '../../types';
import { ANIMAL_DATA_PAGE_BASE_URL } from '../../services/utils';

interface AnimalCardProps {
  animal: Animal;
}

export const AnimalCard = ({ animal }: AnimalCardProps) => {
  const theme = useTheme();

  return (
    <Card
      data-testid="animal-card"
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
  );
};
