import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ClearFiltersButton } from '../../../components/molecules/clear-filters-button';

describe('ClearFiltersButton', () => {
  it('should render with default label', () => {
    render(<ClearFiltersButton onClick={jest.fn()} />);
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  it('should render with custom label', () => {
    render(<ClearFiltersButton onClick={jest.fn()} label="Reset Filters" />);
    expect(screen.getByText('Reset Filters')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const onClick = jest.fn();
    render(<ClearFiltersButton onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
