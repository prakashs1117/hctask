import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ViewModeToggle } from '../../../components/molecules/view-mode-toggle';

describe('ViewModeToggle', () => {
  it('should render list and grid buttons', () => {
    render(<ViewModeToggle viewMode="list" onViewModeChange={jest.fn()} />);
    expect(screen.getByTitle('List view')).toBeInTheDocument();
    expect(screen.getByTitle('Grid view')).toBeInTheDocument();
  });

  it('should call onViewModeChange with "grid" when grid button is clicked', () => {
    const onChange = jest.fn();
    render(<ViewModeToggle viewMode="list" onViewModeChange={onChange} />);
    fireEvent.click(screen.getByTitle('Grid view'));
    expect(onChange).toHaveBeenCalledWith('grid');
  });

  it('should call onViewModeChange with "list" when list button is clicked', () => {
    const onChange = jest.fn();
    render(<ViewModeToggle viewMode="grid" onViewModeChange={onChange} />);
    fireEvent.click(screen.getByTitle('List view'));
    expect(onChange).toHaveBeenCalledWith('list');
  });
});
