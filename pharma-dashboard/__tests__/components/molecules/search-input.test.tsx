import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchInput } from '../../../components/molecules/search-input';

describe('SearchInput', () => {
  it('should render with placeholder', () => {
    render(<SearchInput value="" onChange={jest.fn()} placeholder="Search programs..." />);
    expect(screen.getByPlaceholderText('Search programs...')).toBeInTheDocument();
  });

  it('should use default placeholder', () => {
    render(<SearchInput value="" onChange={jest.fn()} />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('should call onChange when typing', () => {
    const onChange = jest.fn();
    render(<SearchInput value="" onChange={onChange} />);
    fireEvent.change(screen.getByPlaceholderText('Search...'), {
      target: { value: 'test' },
    });
    expect(onChange).toHaveBeenCalledWith('test');
  });

  it('should show clear button when value is present', () => {
    render(<SearchInput value="test" onChange={jest.fn()} />);
    const clearButton = screen.getByRole('button');
    expect(clearButton).toBeInTheDocument();
  });

  it('should not show clear button when value is empty', () => {
    render(<SearchInput value="" onChange={jest.fn()} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should clear value when clear button is clicked', () => {
    const onChange = jest.fn();
    render(<SearchInput value="test" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onChange).toHaveBeenCalledWith('');
  });
});
