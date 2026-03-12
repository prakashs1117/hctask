import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterToggleButton } from '../../../components/molecules/filter-toggle-button';

describe('FilterToggleButton', () => {
  it('should render with default label', () => {
    render(<FilterToggleButton onClick={jest.fn()} />);
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('should render with custom label', () => {
    render(<FilterToggleButton onClick={jest.fn()} label="Program Filters" />);
    expect(screen.getByText('Program Filters')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const onClick = jest.fn();
    render(<FilterToggleButton onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });

  it('should show active count badge when count > 0', () => {
    render(<FilterToggleButton onClick={jest.fn()} activeCount={3} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should not show badge when count is 0', () => {
    render(<FilterToggleButton onClick={jest.fn()} activeCount={0} />);
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });
});
