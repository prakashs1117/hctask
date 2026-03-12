import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../../../components/atoms/loading-spinner';

describe('LoadingSpinner', () => {
  it('should render with default message', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render with custom message', () => {
    render(<LoadingSpinner message="Fetching data..." />);
    expect(screen.getByText('Fetching data...')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<LoadingSpinner className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should render different sizes', () => {
    const { container: sm } = render(<LoadingSpinner size="sm" />);
    expect(sm.querySelector('.h-3')).toBeInTheDocument();

    const { container: md } = render(<LoadingSpinner size="md" />);
    expect(md.querySelector('.h-4')).toBeInTheDocument();

    const { container: lg } = render(<LoadingSpinner size="lg" />);
    expect(lg.querySelector('.h-6')).toBeInTheDocument();
  });
});
