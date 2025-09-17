import { render, screen } from '@testing-library/react';
import { AnimalCard } from '../../../src/app/components/AnimalCard';
import { Animal } from '../../../src/types';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Mock the theme
const theme = createTheme();

describe('AnimalCard', () => {
  const mockAnimal: Animal = {
    id: '123',
    name: 'Test Dog',
    breed: 'Golden Retriever',
    age: '2 years',
    gender: 'Male',
    weight: '70 lbs',
    arrivalDate: '2023-01-01',
    location: 'Shelter A',
    level: 'Friendly',
    adoptionFee: '$200',
    image: 'http://example.com/dog.jpg',
  };

  it('renders animal information correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <AnimalCard animal={mockAnimal} />
      </ThemeProvider>
    );

    expect(screen.getByText('Test Dog')).toBeInTheDocument();
    expect(screen.getByText('Golden Retriever')).toBeInTheDocument();
    expect(screen.getByText(/ID: 123/)).toBeInTheDocument();
    expect(screen.getByText(/Age: 2 years/)).toBeInTheDocument();
    expect(screen.getByText(/Gender: Male/)).toBeInTheDocument();
    expect(screen.getByText(/Weight: 70 lbs/)).toBeInTheDocument();
    expect(screen.getByText(/Arrived: 2023-01-01/)).toBeInTheDocument();
    expect(screen.getByText(/Location: Shelter A/)).toBeInTheDocument();
    expect(screen.getByText(/Level: Friendly/)).toBeInTheDocument();
    expect(screen.getByText(/Adoption Fee: \$200/)).toBeInTheDocument();
    const cardMedia = screen.getByRole('img');
    expect(cardMedia).toHaveStyle(`background-image: url(${mockAnimal.image})`);
  });
});
