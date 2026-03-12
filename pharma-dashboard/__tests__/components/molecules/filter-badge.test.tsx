import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterBadge } from '../../../components/molecules/filter-badge';

describe('FilterBadge', () => {
  it('should render label', () => {
    render(<FilterBadge label="Phase I" onRemove={jest.fn()} />);
    expect(screen.getByText('Phase I')).toBeInTheDocument();
  });

  it('should render search label with quotes', () => {
    render(<FilterBadge label="test" onRemove={jest.fn()} isSearch />);
    expect(screen.getByText('"test"')).toBeInTheDocument();
  });

  it('should truncate long search labels', () => {
    render(<FilterBadge label="very long search term" onRemove={jest.fn()} isSearch />);
    expect(screen.getByText('"very long ..."')).toBeInTheDocument();
  });

  it('should call onRemove when X is clicked', () => {
    const onRemove = jest.fn();
    const { container } = render(<FilterBadge label="Phase I" onRemove={onRemove} />);
    const xIcon = container.querySelector('.cursor-pointer');
    if (xIcon) fireEvent.click(xIcon);
    expect(onRemove).toHaveBeenCalled();
  });
});
