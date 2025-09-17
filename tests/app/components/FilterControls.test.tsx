import { render, fireEvent, screen } from '@testing-library/react';
import { FilterControls } from '../../../src/app/components/FilterControls';
import { Animal } from '../../../src/types';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

describe('FilterControls', () => {
  const mockSetIdFilter = jest.fn();
  const mockSetNameFilter = jest.fn();
  const mockSetBreedFilter = jest.fn();
  const mockSetAgeFilter = jest.fn();
  const mockSetWeightFilter = jest.fn();
  const mockSetLocationFilter = jest.fn();
  const mockSetArrivalDateFilter = jest.fn();
  const mockSetGenderFilter = jest.fn();
  const mockSetAdoptionFeeFilter = jest.fn();
  const mockSetSortBy = jest.fn();

  const defaultProps = {
    idFilter: '',
    setIdFilter: mockSetIdFilter,
    nameFilter: '',
    setNameFilter: mockSetNameFilter,
    breedFilter: '',
    setBreedFilter: mockSetBreedFilter,
    ageFilter: '',
    setAgeFilter: mockSetAgeFilter,
    weightFilter: '',
    setWeightFilter: mockSetWeightFilter,
    locationFilter: '',
    setLocationFilter: mockSetLocationFilter,
    arrivalDateFilter: null,
    setArrivalDateFilter: mockSetArrivalDateFilter,
    genderFilter: '',
    setGenderFilter: mockSetGenderFilter,
    adoptionFeeFilter: '',
    setAdoptionFeeFilter: mockSetAdoptionFeeFilter,
    sortBy: 'id' as keyof Animal,
    setSortBy: mockSetSortBy,
    genderOptions: ['All', 'Male', 'Female'],
    locationOptions: ['All', 'New York', 'Los Angeles'],
    sortableFields: ['id', 'name', 'age', 'weight', 'arrivalDate', 'adoptionFee'] as (keyof Animal)[],
  };

  it('renders all filter controls', () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <FilterControls {...defaultProps} />
      </LocalizationProvider>
    );

    expect(screen.getByLabelText('Filter by Id')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by Breed')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by Max. Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by Max. Weight')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by Location')).toBeInTheDocument();
    const arrivalDateInputs = screen.getAllByLabelText('Filter by Min. Arrival Date');
    expect(arrivalDateInputs.length).toBeGreaterThan(0);
    expect(screen.getByLabelText('Filter by Max. Adoption Fee')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by Gender')).toBeInTheDocument();
    expect(screen.getByLabelText('Sort By')).toBeInTheDocument();
  });

  it('calls the setNameFilter when the name filter changes', () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <FilterControls {...defaultProps} />
      </LocalizationProvider>
    );

    const nameInput = screen.getByLabelText('Filter by Name');
    fireEvent.change(nameInput, { target: { value: 'test' } });

    expect(mockSetNameFilter).toHaveBeenCalledWith('test');
  });

  it('calls the setSortBy when the sort by dropdown changes', () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <FilterControls {...defaultProps} />
      </LocalizationProvider>
    );

    const sortBySelect = screen.getByLabelText('Sort By');
    fireEvent.mouseDown(sortBySelect);

    const option = screen.getByRole('option', { name: 'Name' });
    fireEvent.click(option);

    expect(mockSetSortBy).toHaveBeenCalledWith('name');
  });

  it('calls the setIdFilter when the id filter changes', () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <FilterControls {...defaultProps} />
      </LocalizationProvider>
    );

    const idInput = screen.getByLabelText('Filter by Id');
    fireEvent.change(idInput, { target: { value: '123' } });

    expect(mockSetIdFilter).toHaveBeenCalledWith('123');
  });

  it('calls the setBreedFilter when the breed filter changes', () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <FilterControls {...defaultProps} />
      </LocalizationProvider>
    );

    const breedInput = screen.getByLabelText('Filter by Breed');
    fireEvent.change(breedInput, { target: { value: 'test-breed' } });

    expect(mockSetBreedFilter).toHaveBeenCalledWith('test-breed');
  });

  it('calls the setAgeFilter when the age filter changes', () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <FilterControls {...defaultProps} />
      </LocalizationProvider>
    );

    const ageInput = screen.getByLabelText('Filter by Max. Age');
    fireEvent.change(ageInput, { target: { value: '5' } });

    expect(mockSetAgeFilter).toHaveBeenCalledWith('5');
  });

  it('calls the setWeightFilter when the weight filter changes', () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <FilterControls {...defaultProps} />
      </LocalizationProvider>
    );

    const weightInput = screen.getByLabelText('Filter by Max. Weight');
    fireEvent.change(weightInput, { target: { value: '10' } });

    expect(mockSetWeightFilter).toHaveBeenCalledWith('10');
  });

  it('calls the setAdoptionFeeFilter when the adoption fee filter changes', () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <FilterControls {...defaultProps} />
      </LocalizationProvider>
    );

    const adoptionFeeInput = screen.getByLabelText('Filter by Max. Adoption Fee');
    fireEvent.change(adoptionFeeInput, { target: { value: '100' } });

    expect(mockSetAdoptionFeeFilter).toHaveBeenCalledWith('100');
  });

  it('calls the setLocationFilter when the location filter changes', () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <FilterControls {...defaultProps} />
      </LocalizationProvider>
    );

    const locationSelect = screen.getByLabelText('Filter by Location');
    fireEvent.mouseDown(locationSelect);

    const option = screen.getByRole('option', { name: 'New York' });
    fireEvent.click(option);

    expect(mockSetLocationFilter).toHaveBeenCalledWith('New York');
  });

  it('calls the setGenderFilter when the gender filter changes', () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <FilterControls {...defaultProps} />
      </LocalizationProvider>
    );

    const genderSelect = screen.getByLabelText('Filter by Gender');
    fireEvent.mouseDown(genderSelect);

    const option = screen.getByRole('option', { name: 'Male' });
    fireEvent.click(option);

    expect(mockSetGenderFilter).toHaveBeenCalledWith('Male');
  });
});
