import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoadingIndicator } from '../../../src/app/components/LoadingIndicator';

describe('LoadingIndicator', () => {
  it('renders progress bars with correct percentages', () => {
    render(<LoadingIndicator percentOfAnimalIdsLoaded={50} percentOfAnimalDataLoaded={75} />);

    // Check for the text displaying the percentage
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();

    // Check for the progress bars themselves. They are identified by role 'progressbar'.
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars[0]).toHaveAttribute('aria-valuenow', '50');
    expect(progressBars[1]).toHaveAttribute('aria-valuenow', '75');
  });
});
