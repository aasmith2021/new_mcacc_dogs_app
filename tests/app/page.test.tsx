import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../src/app/page';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Animal } from '../../src/types';

// Mock the theme
const theme = createTheme();

const mockAnimals: Animal[] = [
  {
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
  },
  {
    id: '456',
    name: 'Another Dog',
    breed: 'Labrador',
    age: '1 year',
    gender: 'Female',
    weight: '50 lbs',
    arrivalDate: '2023-02-01',
    location: 'Shelter B',
    level: 'Playful',
    adoptionFee: '$150',
    image: 'http://example.com/anotherdog.jpg',
  },
];

const mockFetch = jest.fn();

global.fetch = mockFetch;

describe('Home', () => {
  beforeEach(() => {
    mockFetch.mockImplementation(async (request, options) => {
      const url = typeof request === 'string' ? request : request.url;

      if (url.includes('/api/scrape/numberOfAnimals')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ numberOfAnimals: mockAnimals.length }),
        };
      }

      if (url.includes('/api/scrape/animalIdBatch')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ animalIds: mockAnimals.map((a) => a.id) }),
        };
      }

      if (url.includes('/api/scrape/singleAnimalData')) {
        let animalId;
        if (typeof request === 'string') {
          animalId = JSON.parse(options?.body as string);
        } else {
          animalId = await (request as Request).json();
        }
        const animal = mockAnimals.find((a) => a.id === animalId);
        return {
          ok: true,
          status: 200,
          json: async () => ({ singleAnimalData: animal }),
        };
      }

      throw new Error(`Unhandled request: ${url}`);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the loading indicator initially and remove it after loading', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    );
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    });
  });

  it('should display animal data after loading', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Test Dog')).toBeInTheDocument();
    expect(screen.getByText('Golden Retriever')).toBeInTheDocument();
  });

  it('should filter animal data by name', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Filter by Name'), { target: { value: 'Another' } });

    expect(screen.getByText('Another Dog')).toBeInTheDocument();
    expect(screen.queryByText('Test Dog')).not.toBeInTheDocument();
  });

  it('should sort animal data by age', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    });

    fireEvent.mouseDown(screen.getByLabelText('Sort By'));
    fireEvent.click(screen.getByText('Age'));

    const animalCards = screen.getAllByTestId('animal-card');
    expect(animalCards[0]).toHaveTextContent('Another Dog');
    expect(animalCards[1]).toHaveTextContent('Test Dog');
  });
});
