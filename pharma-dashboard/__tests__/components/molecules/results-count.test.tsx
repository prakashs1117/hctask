import React from 'react';
import { render, screen } from '@testing-library/react';
import { ResultsCount } from '../../../components/molecules/results-count';

describe('ResultsCount', () => {
  it('should render count text', () => {
    render(<ResultsCount filtered={5} total={10} label="programs" />);
    expect(screen.getByText('5 of 10 programs')).toBeInTheDocument();
    expect(screen.getByText('5/10')).toBeInTheDocument();
  });

  it('should handle zero counts', () => {
    render(<ResultsCount filtered={0} total={0} label="items" />);
    expect(screen.getByText('0 of 0 items')).toBeInTheDocument();
  });

  it('should handle equal filtered and total', () => {
    render(<ResultsCount filtered={10} total={10} label="programs" />);
    expect(screen.getByText('10 of 10 programs')).toBeInTheDocument();
  });
});
