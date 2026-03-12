import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState } from '../../../components/molecules/empty-state';
import { AlertCircle } from 'lucide-react';

describe('EmptyState', () => {
  it('should render message', () => {
    render(<EmptyState message="No programs found" />);
    expect(screen.getByText('No programs found')).toBeInTheDocument();
  });

  it('should render title when provided', () => {
    render(<EmptyState title="Empty" message="No items" />);
    expect(screen.getByText('Empty')).toBeInTheDocument();
  });

  it('should not render title when not provided', () => {
    render(<EmptyState message="No items" />);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('should render clear button when onClear is provided', () => {
    const onClear = jest.fn();
    render(<EmptyState message="No results" onClear={onClear} />);
    const button = screen.getByText('Clear all filters');
    fireEvent.click(button);
    expect(onClear).toHaveBeenCalled();
  });

  it('should use custom clear label', () => {
    render(<EmptyState message="No results" onClear={jest.fn()} clearLabel="Reset" />);
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('should not render clear button when onClear is not provided', () => {
    render(<EmptyState message="No results" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should render custom icon', () => {
    render(<EmptyState icon={AlertCircle} message="Error" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<EmptyState message="Empty" className="test-class" />);
    expect(container.firstChild).toHaveClass('test-class');
  });

  it('should render different sizes', () => {
    const { container: sm } = render(<EmptyState message="Small" size="sm" />);
    expect(sm.firstChild).toHaveClass('py-6');

    const { container: md } = render(<EmptyState message="Medium" size="md" />);
    expect(md.firstChild).toHaveClass('py-8');

    const { container: lg } = render(<EmptyState message="Large" size="lg" />);
    expect(lg.firstChild).toHaveClass('py-16');
  });
});
